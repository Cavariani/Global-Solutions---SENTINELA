// Lógica compartilhada de acesso ao CelesTrak.
// Importada TANTO pela Edge Function da Vercel (api/celestrak.ts) QUANTO pelo
// middleware de desenvolvimento do Vite · garantindo paridade total entre dev e produção.
//
// Buscamos no formato TLE (e não JSON/OMM) porque o satellite.js consome as duas
// linhas do TLE diretamente. Aqui parseamos esse texto para JSON estruturado, de modo
// que o frontend continue recebendo JSON limpo via /api/celestrak.
//
// IMPORTANTE: usar apenas APIs disponíveis tanto no runtime de borda quanto no Node
// (fetch global, sem imports de Node). Imports de tipo são apagados em tempo de compilação.
import type { DadosTLE } from '../tipos/orbital';

// Allowlist de grupos · impede o uso do proxy como open relay.
export const GRUPOS_PERMITIDOS = new Set<string>([
  'active',
  'starlink',
  'stations',
  'cosmos-2251-debris',
  'iridium-33-debris',
  'fengyun-1c-debris',
]);

const BASE_CELESTRAK = 'https://celestrak.org/NORAD/elements/gp.php';

// O CelesTrak pede um User-Agent identificável; requisições genéricas de
// datacenter (ex.: a Edge Function da Vercel) são ocasionalmente bloqueadas
// ou derrubadas com 502 transitório. Identificar a origem reduz esses blips.
const CABECALHOS_FETCH: Record<string, string> = {
  Accept: 'text/plain',
  'User-Agent':
    'SENTINELA/1.0 (+https://global-solutions-sentinela.vercel.app; projeto academico FIAP)',
};

// Falhas transitórias que valem uma re-tentativa (rede instável, rate-limit,
// gateways intermediários). 403/400/404 NÃO entram aqui — re-tentar não ajuda.
const STATUS_RETENTAVEIS = new Set([429, 500, 502, 503, 504]);
const MAX_TENTATIVAS = 3;

const esperar = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Cache em memória da fonte. O CelesTrak responde 403 ("GP data has not updated
// since your last successful download") se o mesmo grupo for rebaixado dentro do
// ciclo de ~2h. Por isso guardamos a última cópia boa e a reaproveitamos.
const CICLO_ATUALIZACAO_MS = 2 * 60 * 60 * 1000; // 2 horas

interface EntradaFonte {
  objetos: DadosTLE[];
  gravadoEm: number;
}

const cacheFonte = new Map<string, EntradaFonte>();

// Converte o texto TLE de 3 linhas do CelesTrak em uma lista estruturada.
// Formato esperado (repetido):
//   NOME DO OBJETO
//   1 NNNNNU ...
//   2 NNNNN ...
export function parsearTLE(textoTle: string): DadosTLE[] {
  const linhas = textoTle
    .split(/\r?\n/)
    .map((linha) => linha.trimEnd())
    .filter((linha) => linha.length > 0);

  const objetos: DadosTLE[] = [];

  for (let i = 0; i + 2 < linhas.length; i += 3) {
    const nome = linhas[i]?.trim();
    const linha1 = linhas[i + 1];
    const linha2 = linhas[i + 2];

    // Valida o trio: linha1 começa com "1 " e linha2 com "2 ".
    if (!nome || !linha1?.startsWith('1 ') || !linha2?.startsWith('2 ')) {
      continue;
    }

    const noradId = linha1.substring(2, 7).trim();

    objetos.push({ noradId, nome, linha1, linha2 });
  }

  return objetos;
}

// Permite semear o cache em memória a partir de uma fonte externa (ex.: cache em
// disco do middleware de dev), evitando rebaixar dados ainda válidos do CelesTrak.
export function semearCacheFonte(
  grupo: string,
  objetos: DadosTLE[],
  gravadoEm: number,
): void {
  cacheFonte.set(grupo, { objetos, gravadoEm });
}

export function lerCacheFonte(grupo: string): EntradaFonte | null {
  return cacheFonte.get(grupo) ?? null;
}

// Busca um grupo no CelesTrak e devolve os TLEs já parseados.
// - Serve do cache em memória se ainda dentro do ciclo de atualização (~2h).
// - Em caso de 403 ("dados não mudaram") ou falha de rede, reaproveita a última
//   cópia boa que tivermos; só lança erro se não houver nenhuma.
export async function buscarTLEsDoCelesTrak(grupo: string): Promise<DadosTLE[]> {
  if (!GRUPOS_PERMITIDOS.has(grupo)) {
    throw new Error(`Grupo inválido: ${grupo}`);
  }

  const emCache = cacheFonte.get(grupo);
  if (emCache && Date.now() - emCache.gravadoEm < CICLO_ATUALIZACAO_MS) {
    return emCache.objetos;
  }

  const url = `${BASE_CELESTRAK}?GROUP=${encodeURIComponent(grupo)}&FORMAT=tle`;

  // Tenta algumas vezes com backoff: um 502/timeout transitório do CelesTrak
  // não deve derrubar a página inteira numa instância de borda sem cache ainda.
  let resposta: Response | null = null;
  let ultimoErroRede: unknown = null;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      resposta = await fetch(url, { headers: CABECALHOS_FETCH });
    } catch (erroRede) {
      ultimoErroRede = erroRede;
      resposta = null;
    }

    // Sucesso ou erro definitivo (não-retentável): encerra o laço.
    if (resposta && (resposta.ok || !STATUS_RETENTAVEIS.has(resposta.status))) {
      break;
    }
    // Falha transitória: espera (300ms, 600ms…) e tenta de novo.
    if (tentativa < MAX_TENTATIVAS) {
      await esperar(300 * tentativa);
    }
  }

  // Esgotou as tentativas sem resposta (rede caiu): serve cópia anterior ou propaga.
  if (!resposta) {
    if (emCache) return emCache.objetos;
    throw (
      ultimoErroRede ?? new Error(`Falha de rede ao buscar o grupo "${grupo}"`)
    );
  }

  if (!resposta.ok) {
    // 403 do CelesTrak significa "você já baixou; reutilize o que tem".
    if (emCache) return emCache.objetos;
    throw new Error(
      `CelesTrak respondeu ${resposta.status} para o grupo "${grupo}"`,
    );
  }

  const texto = await resposta.text();
  const objetos = parsearTLE(texto);
  cacheFonte.set(grupo, { objetos, gravadoEm: Date.now() });
  return objetos;
}

// Serviço de dados do frontend · consome a Edge Function /api/celestrak.
// Implementa cache em memória (TTL 4h) para não refazer fetch a cada renderização.
import type { DadosTLE, RespostaObjetosOrbitais } from '@/tipos/orbital';
import { lerCache, gravarCache } from '@/servicos/cache';

const PREFIXO_CACHE = 'celestrak:';

// Busca um grupo orbital via Edge Function. Resultado fica cacheado por 4h em memória.
export async function buscarGrupoOrbital(grupo: string): Promise<DadosTLE[]> {
  const chave = `${PREFIXO_CACHE}${grupo}`;

  const emCache = lerCache<DadosTLE[]>(chave);
  if (emCache) {
    return emCache;
  }

  const resposta = await fetch(
    `/api/celestrak?grupo=${encodeURIComponent(grupo)}`,
  );

  if (!resposta.ok) {
    throw new Error(
      `Falha ao buscar o grupo "${grupo}" (HTTP ${resposta.status})`,
    );
  }

  const dados = (await resposta.json()) as RespostaObjetosOrbitais;

  if (!Array.isArray(dados.objetos)) {
    throw new Error(`Resposta inesperada da API para o grupo "${grupo}"`);
  }

  gravarCache(chave, dados.objetos);
  return dados.objetos;
}

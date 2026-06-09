// Edge Function da Vercel — proxy para o CelesTrak.
// Resolve CORS (o frontend não pode chamar o CelesTrak direto) e adiciona cache
// de borda de 4 horas. A lógica de fetch + parse fica em src/servicos/celestrak-fonte.ts,
// compartilhada com o middleware de dev do Vite para garantir paridade dev/prod.
//
// Uso: GET /api/celestrak?grupo=active
import {
  GRUPOS_PERMITIDOS,
  buscarTLEsDoCelesTrak,
} from '../src/servicos/celestrak-fonte';

export const config = {
  runtime: 'edge',
};

// Cache de borda da Vercel: 4 horas (14400s) + revalidação em background por 1h.
const CABECALHO_CACHE = 'public, s-maxage=14400, stale-while-revalidate=3600';

export default async function handler(requisicao: Request): Promise<Response> {
  const url = new URL(requisicao.url);
  const grupo = url.searchParams.get('grupo') ?? 'active';

  if (!GRUPOS_PERMITIDOS.has(grupo)) {
    return responderJson(
      {
        erro: 'Grupo inválido',
        grupoRecebido: grupo,
        gruposPermitidos: [...GRUPOS_PERMITIDOS],
      },
      400,
    );
  }

  try {
    const objetos = await buscarTLEsDoCelesTrak(grupo);

    return responderJson(
      {
        objetos,
        totalObjetos: objetos.length,
        atualizadoEm: new Date().toISOString(),
        fonte: 'CelesTrak',
        grupo,
      },
      200,
      CABECALHO_CACHE,
    );
  } catch (erro) {
    return responderJson(
      {
        erro: 'Falha ao consultar o CelesTrak',
        detalhe: erro instanceof Error ? erro.message : String(erro),
        grupo,
      },
      502,
    );
  }
}

// Padroniza respostas JSON com os cabeçalhos corretos.
function responderJson(
  corpo: unknown,
  status: number,
  cacheControl?: string,
): Response {
  const cabecalhos: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };
  if (cacheControl) {
    cabecalhos['Cache-Control'] = cacheControl;
  }
  return new Response(JSON.stringify(corpo), { status, headers: cabecalhos });
}

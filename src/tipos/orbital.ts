// Tipos fundamentais do domínio orbital do SENTINELA.
// Centralizados aqui · não definir tipos inline nos componentes (convenção do projeto).

// Conjunto de elementos orbitais de um objeto (Two-Line Element Set).
export interface DadosTLE {
  noradId: string;
  nome: string;
  linha1: string;
  linha2: string;
}

// Categorias visuais/lógicas de objetos em órbita.
export type CategoriaObjeto =
  | 'detrito'
  | 'satelite-ativo'
  | 'estacao-espacial'
  | 'starlink'
  | 'gps'
  | 'inativo'
  | 'desconhecido';

// Faixas de altitude orbital.
export type FaixaOrbital = 'LEO' | 'MEO' | 'GEO' | 'TODOS';

// Posição em coordenadas Earth-Centered Inertial (km).
export interface PosicaoECI {
  x: number;
  y: number;
  z: number;
}

// Objeto orbital já processado (TLE propagado para uma posição concreta).
export interface ObjetoOrbital {
  noradId: string;
  nome: string;
  categoria: CategoriaObjeto;
  grupo: string; // grupo CelesTrak de origem (camada)
  posicao: PosicaoECI; // Earth-Centered Inertial (km)
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocidadeKmS: number;
  faixaOrbital: FaixaOrbital;
  inclinacaoGraus: number;
  periodoMin: number;
  paisOrigem?: string;
  tle: DadosTLE;
}

// Estado dos filtros aplicados na aba ÓRBITA.
export interface FiltrosOrbita {
  categorias: CategoriaObjeto[];
  faixaOrbital: FaixaOrbital;
}

// TLE já associado à sua camada de origem (saída do hook de dados orbitais).
export interface TLECategorizado {
  tle: DadosTLE;
  categoria: CategoriaObjeto;
  grupo: string; // grupo CelesTrak de origem
}

// Estatísticas ao vivo emitidas pelo Globo para o HUD.
export interface EstatisticasGlobo {
  visiveis: number;
  acimaDeVoce: number | null; // null quando não há geolocalização
}

// Nível de risco de uma conjunção, derivado da distância de menor aproximação.
export type NivelRisco = 'critico' | 'alto' | 'moderado';

// Identificação enxuta de um objeto envolvido em uma conjunção.
export interface ObjetoConjuncao {
  noradId: string;
  nome: string;
  grupo: string; // grupo CelesTrak de origem (camada)
  tle: DadosTLE;
}

// Uma aproximação perigosa (conjunção) detectada entre dois objetos rastreados,
// nas posições propagadas para um instante. É o cerne da análise de risco do SENTINELA.
export interface Conjuncao {
  id: string; // chave estável do par (noradA-noradB)
  a: ObjetoConjuncao;
  b: ObjetoConjuncao;
  distanciaKm: number; // separação atual entre os dois objetos
  velocidadeRelativaKmS: number; // velocidade relativa (proxy de energia de impacto)
  altitudeKm: number; // altitude média do par
  nivel: NivelRisco;
}

// Resposta da Edge Function /api/celestrak · TLEs já parseados em JSON estruturado.
export interface RespostaObjetosOrbitais {
  objetos: DadosTLE[];
  totalObjetos: number;
  atualizadoEm: string;
  fonte: string;
  grupo?: string;
}

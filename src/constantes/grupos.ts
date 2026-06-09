// Grupos do CelesTrak usados no projeto (parâmetro ?grupo= da Edge Function).
export const GRUPOS_CELESTRAK = {
  ATIVOS: 'active',
  STARLINK: 'starlink',
  ESTACOES: 'stations',
  DETRITOS_COSMOS: 'cosmos-2251-debris',
  DETRITOS_IRIDIUM: 'iridium-33-debris',
  DETRITOS_FENGYUN: 'fengyun-1c-debris',
} as const;

export type GrupoCelesTrak =
  (typeof GRUPOS_CELESTRAK)[keyof typeof GRUPOS_CELESTRAK];

// Lista de todos os grupos de detritos · usada quando filtramos por categoria "detrito".
export const GRUPOS_DETRITOS: GrupoCelesTrak[] = [
  GRUPOS_CELESTRAK.DETRITOS_COSMOS,
  GRUPOS_CELESTRAK.DETRITOS_IRIDIUM,
  GRUPOS_CELESTRAK.DETRITOS_FENGYUN,
];

// Categoria visual associada a cada grupo do CelesTrak.
import type { CategoriaObjeto } from '@/tipos/orbital';

export const CATEGORIA_POR_GRUPO: Record<GrupoCelesTrak, CategoriaObjeto> = {
  active: 'satelite-ativo',
  starlink: 'starlink',
  stations: 'estacao-espacial',
  'cosmos-2251-debris': 'detrito',
  'iridium-33-debris': 'detrito',
  'fengyun-1c-debris': 'detrito',
};

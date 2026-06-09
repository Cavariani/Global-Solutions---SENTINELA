// Paleta "Crise Fria" exportada como constantes TS · para uso em Three.js e lógica
// (onde não dá para usar classes do Tailwind ou variáveis CSS diretamente).
import type { CategoriaObjeto } from '@/tipos/orbital';

export const CORES = {
  fundoPrincipal: '#050810',
  fundoSecundario: '#0a0f1e',
  fundoElevado: '#111827',

  primaria: '#4fc3f7',
  primariaHover: '#81d4fa',
  primariaDim: '#1a4a6b',

  alerta: '#ff5722',
  alertaHover: '#ff7043',
  alertaDim: '#5c1a00',

  textoPrincipal: '#e0e0e0',
  textoSecundario: '#8899aa',
  textoDestaque: '#ffffff',

  acento: '#1a237e',
  borda: '#1e2d4a',
} as const;

// Cor de cada categoria de objeto no globo 3D.
export const COR_POR_CATEGORIA: Record<CategoriaObjeto, string> = {
  detrito: '#ff5722',
  'satelite-ativo': '#4fc3f7',
  'estacao-espacial': '#ffffff',
  starlink: '#4fc3f7',
  gps: '#81d4fa',
  inativo: '#8899aa',
  desconhecido: '#8899aa',
};

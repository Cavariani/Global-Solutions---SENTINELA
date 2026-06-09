// Camadas orbitais · cada grupo do CelesTrak vira uma camada com identidade visual
// própria (cor, tamanho do ponto) e contexto (operador ou evento de origem).
// É o que permite ao usuário entender "de quem é cada objeto" no globo.
import { GRUPOS_CELESTRAK, type GrupoCelesTrak } from '@/constantes/grupos';
import type { CategoriaObjeto } from '@/tipos/orbital';

export interface Camada {
  grupo: GrupoCelesTrak;
  rotulo: string;
  // Operador responsável ou evento que gerou os objetos.
  contexto: string;
  cor: string;
  categoria: CategoriaObjeto;
  // Raio do ponto na cena Three.js.
  tamanho: number;
}

// Ordem de exibição no painel de filtros (e prioridade no limite de 8.000 pontos).
export const CAMADAS: Camada[] = [
  {
    grupo: GRUPOS_CELESTRAK.ESTACOES,
    rotulo: 'Estações espaciais',
    contexto: 'ISS, Tiangong e módulos tripulados',
    cor: '#ffffff',
    categoria: 'estacao-espacial',
    tamanho: 0.05,
  },
  {
    grupo: GRUPOS_CELESTRAK.ATIVOS,
    rotulo: 'Satélites ativos',
    contexto: 'Operacionais. Diversos operadores e países',
    cor: '#4fc3f7',
    categoria: 'satelite-ativo',
    tamanho: 0.02,
  },
  {
    grupo: GRUPOS_CELESTRAK.STARLINK,
    rotulo: 'Starlink',
    contexto: 'Constelação de internet · SpaceX',
    cor: '#00e5ff',
    categoria: 'starlink',
    tamanho: 0.018,
  },
  {
    grupo: GRUPOS_CELESTRAK.DETRITOS_FENGYUN,
    rotulo: 'Detritos Fengyun-1C',
    contexto: 'Teste antissatélite · China, 2007',
    cor: '#ff1744',
    categoria: 'detrito',
    tamanho: 0.015,
  },
  {
    grupo: GRUPOS_CELESTRAK.DETRITOS_COSMOS,
    rotulo: 'Detritos Cosmos 2251',
    contexto: 'Colisão Cosmos–Iridium, 2009',
    cor: '#ff5722',
    categoria: 'detrito',
    tamanho: 0.015,
  },
  {
    grupo: GRUPOS_CELESTRAK.DETRITOS_IRIDIUM,
    rotulo: 'Detritos Iridium 33',
    contexto: 'Colisão Cosmos–Iridium, 2009',
    cor: '#ffab00',
    categoria: 'detrito',
    tamanho: 0.015,
  },
];

export const CAMADA_POR_GRUPO: Record<GrupoCelesTrak, Camada> = CAMADAS.reduce(
  (acc, camada) => {
    acc[camada.grupo] = camada;
    return acc;
  },
  {} as Record<GrupoCelesTrak, Camada>,
);

// Grupos na ordem das camadas · usado como carga inicial da aba ÓRBITA.
export const GRUPOS_EM_ORDEM: GrupoCelesTrak[] = CAMADAS.map((c) => c.grupo);

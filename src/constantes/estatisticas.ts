// Dados reais processados para as abas DADOS e CRISE.
// Fontes: ESA Space Environment Report 2025, NASA ODPO, CelesTrak SATCAT.
// Números arredondados para comunicação pública · ordens de grandeza fiéis às fontes.
import type {
  PontoCrescimento,
  FatiaAltitude,
  FatiaTipo,
  PaisOrbital,
  EventoFragmentacao,
} from '@/tipos/dados';

// Estimativas globais de fragmentos por faixa de tamanho (ESA/NASA, 2025).
export const FRAGMENTOS = {
  maioresQue10cm: 36500, // rastreáveis e catalogados
  entre1e10cm: 1100000, // ~1,1 milhão
  entre1mmE1cm: 140000000, // ~140 milhões, o número-choque da CRISE
} as const;

// Velocidade orbital típica de colisão em LEO.
export const VELOCIDADE_ORBITAL_KMH = 27000;

// Série histórica de objetos catalogados em órbita (1957–2026).
// Marcos reais ancoram a curva; valores intermediários interpolam a tendência.
export const CRESCIMENTO_HISTORICO: PontoCrescimento[] = [
  { ano: 1957, objetos: 2, marco: 'Sputnik 1, o primeiro objeto em órbita' },
  { ano: 1970, objetos: 1800 },
  { ano: 1980, objetos: 4800 },
  { ano: 1990, objetos: 6700 },
  { ano: 2000, objetos: 9000 },
  { ano: 2007, objetos: 12500, marco: 'Teste ASAT Fengyun-1C gera +3.500 detritos' },
  { ano: 2009, objetos: 15500, marco: 'Colisão Iridium 33 × Cosmos 2251' },
  { ano: 2015, objetos: 17500 },
  { ano: 2019, objetos: 19500, marco: 'Início da era das megaconstelações (Starlink)' },
  { ano: 2022, objetos: 25500 },
  { ano: 2024, objetos: 33000 },
  { ano: 2026, objetos: 36500, marco: 'Mais de 36.500 objetos rastreados hoje' },
];

// Distribuição de objetos por faixa de altitude.
export const DISTRIBUICAO_ALTITUDE: FatiaAltitude[] = [
  { faixa: 'LEO', objetos: 28800, descricao: 'Órbita Baixa · 160–2.000 km' },
  { faixa: 'MEO', objetos: 2200, descricao: 'Órbita Média · 2.000–35.786 km' },
  { faixa: 'GEO', objetos: 5500, descricao: 'Órbita Geoestacionária · 35.786 km' },
];

// Distribuição de objetos por tipo (donut).
export const DISTRIBUICAO_TIPO: FatiaTipo[] = [
  { tipo: 'Detritos', valor: 22000, cor: '#ff5722' },
  { tipo: 'Satélites ativos', valor: 9800, cor: '#4fc3f7' },
  { tipo: 'Corpos de foguete', valor: 2100, cor: '#ff7043' },
  { tipo: 'Inativos / desconhecidos', valor: 2600, cor: '#8899aa' },
];

// Top 10 países/agências por número de objetos em órbita.
export const TOP_PAISES: PaisOrbital[] = [
  { pais: 'Estados Unidos', objetos: 8600 },
  { pais: 'Rússia / CEI', objetos: 6500 },
  { pais: 'China', objetos: 6100 },
  { pais: 'Reino Unido', objetos: 760 },
  { pais: 'Japão', objetos: 380 },
  { pais: 'Índia', objetos: 300 },
  { pais: 'França', objetos: 290 },
  { pais: 'ESA (Europa)', objetos: 230 },
  { pais: 'Alemanha', objetos: 110 },
  { pais: 'Canadá', objetos: 90 },
];

// Eventos reais de fragmentação que mais geraram detritos.
export const EVENTOS_FRAGMENTACAO: EventoFragmentacao[] = [
  {
    ano: 2007,
    titulo: 'Teste ASAT Fengyun-1C',
    detritosGerados: 3500,
    descricao:
      'A China destruiu seu próprio satélite meteorológico com um míssil. Criou a maior nuvem de detritos da história até então.',
    tipo: 'asat',
  },
  {
    ano: 2009,
    titulo: 'Colisão Iridium 33 × Cosmos 2251',
    detritosGerados: 2300,
    descricao:
      'A primeira colisão acidental entre dois satélites inteiros. Um ativo, um morto. Destroços a 42.000 km/h.',
    tipo: 'colisao',
  },
  {
    ano: 2021,
    titulo: 'Teste ASAT russo (Cosmos 1408)',
    detritosGerados: 1500,
    descricao:
      'Outro satélite destruído deliberadamente. A ISS precisou manobrar e a tripulação se abrigou nas cápsulas.',
    tipo: 'asat',
  },
  {
    ano: 2022,
    titulo: 'Explosão de estágio de foguete (LongMarch)',
    detritosGerados: 700,
    descricao:
      'Corpos de foguete abandonados com combustível residual continuam explodindo anos após o lançamento.',
    tipo: 'explosao',
  },
];

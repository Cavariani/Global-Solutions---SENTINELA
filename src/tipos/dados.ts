// Tipos para os gráficos da aba DADOS e o storytelling da aba CRISE.

// Ponto da série histórica de objetos catalogados em órbita.
export interface PontoCrescimento {
  ano: number;
  objetos: number;
  marco?: string; // rótulo de evento marcante (Sputnik, Iridium/Cosmos, era Starlink...)
}

// Fatia da distribuição por faixa de altitude.
export interface FatiaAltitude {
  faixa: string; // 'LEO', 'MEO', 'GEO'
  objetos: number;
  descricao: string;
}

// Fatia da distribuição por tipo de objeto (donut).
export interface FatiaTipo {
  tipo: string;
  valor: number;
  cor: string;
}

// País com objetos rastreados em órbita.
export interface PaisOrbital {
  pais: string;
  objetos: number;
}

// Evento de fragmentação real (colisão ou teste ASAT) que gerou detritos.
export interface EventoFragmentacao {
  ano: number;
  titulo: string;
  detritosGerados: number;
  descricao: string;
  tipo: 'colisao' | 'asat' | 'explosao';
}

// Capítulo da aba CRISE · usado para navegação/progresso.
export interface CapituloCrise {
  id: string;
  titulo: string;
}

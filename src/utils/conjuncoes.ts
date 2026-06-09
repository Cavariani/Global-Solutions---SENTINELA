// Motor de análise de conjunções · o coração analítico do SENTINELA.
// Propaga (SGP4) todos os objetos para um instante e detecta pares que estão
// perigosamente próximos. É exatamente o problema que operadores de satélite
// enfrentam diariamente: "conjunction assessment" / alerta de colisão.
//
// Desempenho: comparar todos os pares seria O(n²) (inviável para milhares de
// objetos). Usamos um grid espacial 3D com célula = limiar de distância, então
// cada objeto só é comparado com vizinhos das células adjacentes · O(n) na prática.
import { RAIO_TERRA_KM, calcularEstadoECI } from '@/utils/orbital';
import type { Conjuncao, NivelRisco, TLECategorizado } from '@/tipos/orbital';

// Distância (km) abaixo da qual dois objetos são considerados em conjunção.
export const LIMIAR_CONJUNCAO_KM = 10;
// Teto de objetos analisados · amostra uniforme acima disso (custo previsível).
const MAX_OBJETOS_ANALISE = 9000;
// Máximo de conjunções retornadas (as mais próximas primeiro).
const MAX_RESULTADOS = 40;

// Classifica o risco pela distância de menor aproximação.
function classificarRisco(distanciaKm: number): NivelRisco {
  if (distanciaKm < 2) return 'critico';
  if (distanciaKm < 5) return 'alto';
  return 'moderado';
}

interface EstadoObjeto {
  item: TLECategorizado;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  alt: number;
}

export interface ResultadoAnalise {
  conjuncoes: Conjuncao[];
  totalAnalisado: number; // quantos objetos entraram na varredura
  criticas: number; // conjunções com distância < 2 km
}

export function analisarConjuncoes(
  objetos: TLECategorizado[],
  instante: Date,
  limiarKm: number = LIMIAR_CONJUNCAO_KM,
): ResultadoAnalise {
  // Amostra uniforme se exceder o teto (mantém a varredura fluida).
  let lista = objetos;
  if (objetos.length > MAX_OBJETOS_ANALISE) {
    const passo = objetos.length / MAX_OBJETOS_ANALISE;
    lista = [];
    for (let i = 0; i < MAX_OBJETOS_ANALISE; i++) {
      lista.push(objetos[Math.floor(i * passo)]);
    }
  }

  // Propaga todos para o instante (posição + velocidade em ECI).
  const estados: EstadoObjeto[] = [];
  for (const item of lista) {
    const estado = calcularEstadoECI(item.tle, instante);
    if (!estado) continue;
    const { pos, vel } = estado;
    const raio = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
    estados.push({
      item,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      vx: vel.x,
      vy: vel.y,
      vz: vel.z,
      alt: raio - RAIO_TERRA_KM,
    });
  }

  // Grid espacial: célula = limiar. Objetos a menos de `limiar` km estão sempre
  // na mesma célula ou em células adjacentes · só comparamos esses candidatos.
  const tamanhoCelula = Math.max(limiarKm, 1);
  const chave = (ix: number, iy: number, iz: number) => `${ix}|${iy}|${iz}`;
  const grid = new Map<string, number[]>();
  estados.forEach((e, idx) => {
    const k = chave(
      Math.floor(e.x / tamanhoCelula),
      Math.floor(e.y / tamanhoCelula),
      Math.floor(e.z / tamanhoCelula),
    );
    const lst = grid.get(k);
    if (lst) lst.push(idx);
    else grid.set(k, [idx]);
  });

  const limiar2 = limiarKm * limiarKm;
  const conjuncoes: Conjuncao[] = [];

  estados.forEach((a, ia) => {
    const cx = Math.floor(a.x / tamanhoCelula);
    const cy = Math.floor(a.y / tamanhoCelula);
    const cz = Math.floor(a.z / tamanhoCelula);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const vizinhos = grid.get(chave(cx + dx, cy + dy, cz + dz));
          if (!vizinhos) continue;
          for (const ib of vizinhos) {
            if (ib <= ia) continue; // cada par não-ordenado uma única vez
            const b = estados[ib];
            if (a.item.tle.noradId === b.item.tle.noradId) continue;
            const ddx = a.x - b.x;
            const ddy = a.y - b.y;
            const ddz = a.z - b.z;
            const d2 = ddx * ddx + ddy * ddy + ddz * ddz;
            if (d2 > limiar2) continue;
            const distanciaKm = Math.sqrt(d2);
            const velocidadeRelativaKmS = Math.sqrt(
              (a.vx - b.vx) ** 2 + (a.vy - b.vy) ** 2 + (a.vz - b.vz) ** 2,
            );
            conjuncoes.push({
              id: `${a.item.tle.noradId}-${b.item.tle.noradId}`,
              a: {
                noradId: a.item.tle.noradId,
                nome: a.item.tle.nome,
                grupo: a.item.grupo,
                tle: a.item.tle,
              },
              b: {
                noradId: b.item.tle.noradId,
                nome: b.item.tle.nome,
                grupo: b.item.grupo,
                tle: b.item.tle,
              },
              distanciaKm,
              velocidadeRelativaKmS,
              altitudeKm: (a.alt + b.alt) / 2,
              nivel: classificarRisco(distanciaKm),
            });
          }
        }
      }
    }
  });

  conjuncoes.sort((x, y) => x.distanciaKm - y.distanciaKm);
  const criticas = conjuncoes.filter((c) => c.nivel === 'critico').length;

  return {
    conjuncoes: conjuncoes.slice(0, MAX_RESULTADOS),
    totalAnalisado: estados.length,
    criticas,
  };
}

// Utilitários de mecânica orbital · propagação de TLEs via satellite.js (modelo SGP4).
import * as satellite from 'satellite.js';
import { Vector3 } from 'three';
import type { DadosTLE, FaixaOrbital, PosicaoECI } from '@/tipos/orbital';

// Raio da Terra em km (esfera média).
export const RAIO_TERRA_KM = 6371;

// Raio do globo na cena Three.js (unidades de cena). Bate com SphereGeometry(5, ...).
export const RAIO_GLOBO_CENA = 5;

// Cache de satrec por TLE · reconstruir a cada frame é caro.
const cacheSatrec = new Map<string, satellite.SatRec>();

function obterSatrec(tle: DadosTLE): satellite.SatRec | null {
  const existente = cacheSatrec.get(tle.noradId);
  if (existente) return existente;

  try {
    const satrec = satellite.twoline2satrec(tle.linha1, tle.linha2);
    // satrec.error !== 0 indica TLE inválido.
    if (satrec.error) return null;
    cacheSatrec.set(tle.noradId, satrec);
    return satrec;
  } catch {
    return null;
  }
}

// Posição em coordenadas Earth-Centered Inertial (km) para um instante.
export function calcularPosicao3D(
  tle: DadosTLE,
  instante: Date,
): PosicaoECI | null {
  const satrec = obterSatrec(tle);
  if (!satrec) return null;

  const propagado = satellite.propagate(satrec, instante);
  const posicao = propagado.position;
  if (!posicao || typeof posicao === 'boolean') return null;

  return { x: posicao.x, y: posicao.y, z: posicao.z };
}

// Resultado geodésico de um TLE em um instante.
export interface PosicaoGeodetica {
  lat: number; // graus
  lng: number; // graus
  alt: number; // km acima da superfície
  velocidadeKmS: number;
}

// Converte um TLE em latitude/longitude/altitude + velocidade para um instante.
export function tleParaLatLng(
  tle: DadosTLE,
  instante: Date,
): PosicaoGeodetica | null {
  const satrec = obterSatrec(tle);
  if (!satrec) return null;

  const propagado = satellite.propagate(satrec, instante);
  const posicao = propagado.position;
  const velocidade = propagado.velocity;
  if (!posicao || typeof posicao === 'boolean') return null;

  const gmst = satellite.gstime(instante);
  const geodetica = satellite.eciToGeodetic(posicao, gmst);

  const lat = satellite.degreesLat(geodetica.latitude);
  const lng = satellite.degreesLong(geodetica.longitude);
  const alt = geodetica.height; // km

  let velocidadeKmS = 0;
  if (velocidade && typeof velocidade !== 'boolean') {
    velocidadeKmS = Math.sqrt(
      velocidade.x ** 2 + velocidade.y ** 2 + velocidade.z ** 2,
    );
  }

  return { lat, lng, alt, velocidadeKmS };
}

// Classifica a altitude na faixa orbital correspondente.
//   LEO: 160–2000 km · MEO: 2000–35.586 km · GEO: ~35.586 km e acima
export function determinarFaixaOrbital(altitudeKm: number): FaixaOrbital {
  if (altitudeKm < 2000) return 'LEO';
  if (altitudeKm < 35586) return 'MEO';
  return 'GEO';
}

// Converte lat/lng/alt em um vetor 3D na cena, na escala do globo.
export function latLngParaVetor3D(
  lat: number,
  lng: number,
  altKm: number,
  raioGlobo: number = RAIO_GLOBO_CENA,
): Vector3 {
  // Altitude na escala da cena (proporcional ao raio da Terra).
  const raio = raioGlobo + (altKm / RAIO_TERRA_KM) * raioGlobo;

  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -raio * Math.sin(phi) * Math.cos(theta);
  const z = raio * Math.sin(phi) * Math.sin(theta);
  const y = raio * Math.cos(phi);

  return new Vector3(x, y, z);
}

// Estado cinemático completo (posição + velocidade) em ECI (km e km/s).
export interface EstadoECI {
  pos: PosicaoECI;
  vel: PosicaoECI;
}

// Posição E velocidade em ECI para um instante · base da análise de conjunções
// (precisamos da velocidade relativa, não só da distância).
export function calcularEstadoECI(
  tle: DadosTLE,
  instante: Date,
): EstadoECI | null {
  const satrec = obterSatrec(tle);
  if (!satrec) return null;

  const propagado = satellite.propagate(satrec, instante);
  const posicao = propagado.position;
  const velocidade = propagado.velocity;
  if (!posicao || typeof posicao === 'boolean') return null;
  if (!velocidade || typeof velocidade === 'boolean') return null;

  return {
    pos: { x: posicao.x, y: posicao.y, z: posicao.z },
    vel: { x: velocidade.x, y: velocidade.y, z: velocidade.z },
  };
}

// Calcula os pontos de uma volta orbital completa em coordenadas de cena,
// amostrando a posição do objeto ao longo de um período a partir do instante dado.
// Usado para desenhar a trajetória do objeto selecionado no globo.
export function calcularTrajetoriaOrbital(
  tle: DadosTLE,
  instante: Date,
  amostras = 180,
  raioGlobo: number = RAIO_GLOBO_CENA,
): Vector3[] | null {
  const periodoMin = periodoOrbitalMin(extrairMeanMotion(tle.linha2));
  if (periodoMin <= 0) return null;

  const periodoMs = periodoMin * 60 * 1000;
  const pontos: Vector3[] = [];
  for (let i = 0; i <= amostras; i++) {
    const instanteAmostra = new Date(
      instante.getTime() + (periodoMs * i) / amostras,
    );
    const geo = tleParaLatLng(tle, instanteAmostra);
    if (!geo) continue;
    pontos.push(latLngParaVetor3D(geo.lat, geo.lng, geo.alt, raioGlobo));
  }
  return pontos.length > 1 ? pontos : null;
}

// Limpa o cache de satrec (ex.: ao recarregar TLEs novos).
export function limparCacheSatrec(): void {
  cacheSatrec.clear();
}

// Inclinação orbital (graus) · colunas 9–16 da segunda linha do TLE.
export function extrairInclinacao(linha2: string): number {
  return parseFloat(linha2.substring(8, 16));
}

// Mean motion (revoluções por dia) · colunas 53–63 da segunda linha do TLE.
export function extrairMeanMotion(linha2: string): number {
  return parseFloat(linha2.substring(52, 63));
}

// Período orbital em minutos a partir do mean motion (rev/dia).
export function periodoOrbitalMin(meanMotion: number): number {
  return meanMotion > 0 ? 1440 / meanMotion : 0;
}

// Distância great-circle (graus) entre dois pontos lat/lng. Usado para descobrir
// quantos objetos estão "acima de você agora".
export function distanciaGreatCircleGraus(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const rad = Math.PI / 180;
  const a1 = lat1 * rad;
  const a2 = lat2 * rad;
  const dLng = (lng2 - lng1) * rad;
  const cosC =
    Math.sin(a1) * Math.sin(a2) +
    Math.cos(a1) * Math.cos(a2) * Math.cos(dLng);
  return Math.acos(Math.min(1, Math.max(-1, cosC))) / rad;
}

// Formatação de números, datas e unidades · sempre em pt-BR.

const formatadorNumero = new Intl.NumberFormat('pt-BR');

// 36500 → "36.500"
export function formatarNumero(valor: number): string {
  return formatadorNumero.format(Math.round(valor));
}

// 412.7 → "413 km"
export function formatarAltitude(altitudeKm: number): string {
  return `${formatarNumero(altitudeKm)} km`;
}

// 7.66 → "7,66 km/s"
export function formatarVelocidade(velocidadeKmS: number): string {
  return `${velocidadeKmS.toFixed(2).replace('.', ',')} km/s`;
}

// Date → "02/06/2026 14:35:07"
export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(data);
}

// Date → "14:35:07" (só hora · usado no HUD)
export function formatarHora(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'medium' }).format(data);
}

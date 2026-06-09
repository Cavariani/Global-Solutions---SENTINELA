// Tooltip customizado no tema "Crise Fria", compartilhado pelos gráficos da aba DADOS.
import type { TooltipProps } from 'recharts';
import { formatarNumero } from '@/utils/formatadores';

export function TooltipGrafico({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-borda bg-fundo-elevado/95 px-3 py-2 backdrop-blur-md shadow-glow-primaria">
      {label !== undefined && (
        <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-texto-secundario">
          {label}
        </p>
      )}
      {payload.map((item) => (
        <p
          key={String(item.dataKey)}
          className="font-mono text-sm tabular-nums"
          style={{ color: (item.color as string) ?? '#e0e0e0' }}
        >
          {item.name}: {formatarNumero(Number(item.value))}
        </p>
      ))}
    </div>
  );
}

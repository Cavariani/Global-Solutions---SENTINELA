// Gráfico de linha · crescimento histórico de objetos em órbita (1957–2026).
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CRESCIMENTO_HISTORICO } from '@/constantes/estatisticas';
import { CORES } from '@/constantes/cores';
import { TooltipGrafico } from './TooltipGrafico';

export function GraficoCrescimento() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={CRESCIMENTO_HISTORICO} margin={{ top: 10, right: 12, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="gradienteCrescimento" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CORES.alerta} stopOpacity={0.5} />
            <stop offset="100%" stopColor={CORES.alerta} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CORES.borda} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="ano"
          stroke={CORES.textoSecundario}
          tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          stroke={CORES.textoSecundario}
          tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}
          tickLine={false}
          width={52}
          tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <Tooltip content={<TooltipGrafico />} cursor={{ stroke: CORES.primaria, strokeOpacity: 0.3 }} />
        <Area
          type="monotone"
          dataKey="objetos"
          name="Objetos"
          stroke={CORES.alerta}
          strokeWidth={2}
          fill="url(#gradienteCrescimento)"
          activeDot={{ r: 5, fill: CORES.alertaHover }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Gráfico de barras horizontais · top 10 países por objetos em órbita.
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TOP_PAISES } from '@/constantes/estatisticas';
import { CORES } from '@/constantes/cores';
import { TooltipGrafico } from './TooltipGrafico';

export function GraficoPaises() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={TOP_PAISES}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <CartesianGrid stroke={CORES.borda} strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          stroke={CORES.textoSecundario}
          tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}
          tickLine={false}
          tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
        />
        <YAxis
          type="category"
          dataKey="pais"
          stroke={CORES.textoSecundario}
          tick={{ fontFamily: 'JetBrains Mono', fontSize: 11, fill: CORES.textoPrincipal }}
          tickLine={false}
          width={104}
        />
        <Tooltip content={<TooltipGrafico />} cursor={{ fill: 'rgba(79,195,247,0.06)' }} />
        <Bar dataKey="objetos" name="Objetos" radius={[0, 4, 4, 0]}>
          {TOP_PAISES.map((pais, indice) => (
            <Cell
              key={pais.pais}
              fill={indice === 0 ? CORES.alerta : CORES.primaria}
              fillOpacity={indice === 0 ? 0.95 : 0.5 + (TOP_PAISES.length - indice) / (TOP_PAISES.length * 2)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

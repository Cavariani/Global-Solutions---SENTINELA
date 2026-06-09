// Gráfico donut · distribuição de objetos por tipo.
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { DISTRIBUICAO_TIPO } from '@/constantes/estatisticas';
import { CORES } from '@/constantes/cores';
import { formatarNumero } from '@/utils/formatadores';
import { TooltipGrafico } from './TooltipGrafico';

export function GraficoDistribuicao() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <ResponsiveContainer width="100%" height={240} className="max-w-[260px]">
        <PieChart>
          <Pie
            data={DISTRIBUICAO_TIPO}
            dataKey="valor"
            nameKey="tipo"
            innerRadius={58}
            outerRadius={92}
            paddingAngle={2}
            stroke={CORES.fundoPrincipal}
            strokeWidth={2}
          >
            {DISTRIBUICAO_TIPO.map((fatia) => (
              <Cell key={fatia.tipo} fill={fatia.cor} />
            ))}
          </Pie>
          <Tooltip content={<TooltipGrafico />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda */}
      <ul className="w-full space-y-3">
        {DISTRIBUICAO_TIPO.map((fatia) => (
          <li key={fatia.tipo} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: fatia.cor }} />
              <span className="text-sm text-texto-principal">{fatia.tipo}</span>
            </span>
            <span className="font-mono text-sm tabular-nums text-texto-secundario">
              {formatarNumero(fatia.valor)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

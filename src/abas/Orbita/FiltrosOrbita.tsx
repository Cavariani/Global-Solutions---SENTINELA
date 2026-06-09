// Painel de filtros da aba ÓRBITA · controla quais camadas aparecem no globo
// e em qual faixa orbital. Colapsável para não cobrir o globo.
import { useState } from 'react';
import { BotaoFiltro } from '@/componentes/BotaoFiltro';
import { CAMADAS } from '@/constantes/camadas';
import { formatarNumero } from '@/utils/formatadores';
import type { FaixaOrbital } from '@/tipos/orbital';
import type { Camada } from '@/constantes/camadas';
import type { GrupoCelesTrak } from '@/constantes/grupos';

const FAIXAS: { valor: FaixaOrbital; rotulo: string; titulo: string }[] = [
  { valor: 'TODOS', rotulo: 'TODAS', titulo: 'Todas as altitudes' },
  { valor: 'LEO', rotulo: 'LEO', titulo: 'Órbita baixa · 160–2.000 km' },
  { valor: 'MEO', rotulo: 'MEO', titulo: 'Órbita média · 2.000–35.586 km' },
  { valor: 'GEO', rotulo: 'GEO', titulo: 'Geoestacionária · ~35.786 km' },
];

interface PropsFiltrosOrbita {
  camadasAtivas: Record<string, boolean>;
  totalPorGrupo: Record<string, number>;
  faixaOrbital: FaixaOrbital;
  aoAlternarCamada: (grupo: GrupoCelesTrak) => void;
  aoMudarFaixa: (faixa: FaixaOrbital) => void;
  aoDefinirTodas: (ativas: boolean) => void;
}

export function FiltrosOrbita({
  camadasAtivas,
  totalPorGrupo,
  faixaOrbital,
  aoAlternarCamada,
  aoMudarFaixa,
  aoDefinirTodas,
}: PropsFiltrosOrbita) {
  const [aberto, setAberto] = useState(true);

  return (
    <div className="pointer-events-auto absolute right-6 top-28 z-30 w-72 max-w-[calc(100vw-3rem)]">
      <div className="cantoneiras relative overflow-hidden rounded-lg border border-borda bg-fundo-secundario/85 shadow-glow-primaria backdrop-blur-md">
        {/* Cabeçalho */}
        <button
          onClick={() => setAberto((a) => !a)}
          className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-fundo-elevado/50"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primaria">
            Camadas orbitais
          </span>
          <span className="font-mono text-xs text-texto-secundario">
            {aberto ? '–' : '+'}
          </span>
        </button>

        {aberto && (
          <div className="border-t border-borda/60 px-4 pb-4 pt-3">
            {/* Atalhos */}
            <div className="mb-3 flex gap-2 font-mono text-[0.65rem] uppercase tracking-wide">
              <button
                onClick={() => aoDefinirTodas(true)}
                className="text-texto-secundario transition-colors hover:text-primaria"
              >
                Todas
              </button>
              <span className="text-borda">|</span>
              <button
                onClick={() => aoDefinirTodas(false)}
                className="text-texto-secundario transition-colors hover:text-alerta"
              >
                Nenhuma
              </button>
            </div>

            {/* Toggles de camada */}
            <ul className="flex flex-col gap-1">
              {CAMADAS.map((camada) => (
                <ToggleCamada
                  key={camada.grupo}
                  camada={camada}
                  ativa={camadasAtivas[camada.grupo] ?? false}
                  total={totalPorGrupo[camada.grupo] ?? 0}
                  aoClicar={() => aoAlternarCamada(camada.grupo)}
                />
              ))}
            </ul>

            {/* Faixa orbital */}
            <div className="mt-4 border-t border-borda/60 pt-3">
              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-texto-secundario">
                Faixa de altitude
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FAIXAS.map((faixa) => (
                  <BotaoFiltro
                    key={faixa.valor}
                    ativo={faixaOrbital === faixa.valor}
                    aoClicar={() => aoMudarFaixa(faixa.valor)}
                  >
                    <span title={faixa.titulo}>{faixa.rotulo}</span>
                  </BotaoFiltro>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface PropsToggleCamada {
  camada: Camada;
  ativa: boolean;
  total: number;
  aoClicar: () => void;
}

function ToggleCamada({ camada, ativa, total, aoClicar }: PropsToggleCamada) {
  return (
    <li>
      <button
        onClick={aoClicar}
        className={[
          'group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors',
          ativa ? 'bg-fundo-elevado/60' : 'opacity-45 hover:opacity-80',
        ].join(' ')}
        title={camada.contexto}
      >
        {/* Indicador de cor */}
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full transition-shadow"
          style={{
            backgroundColor: camada.cor,
            boxShadow: ativa ? `0 0 8px ${camada.cor}` : 'none',
          }}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-texto-principal">
            {camada.rotulo}
          </span>
          <span className="block truncate font-mono text-[0.65rem] text-texto-secundario">
            {camada.contexto}
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-texto-secundario">
          {total > 0 ? formatarNumero(total) : '–'}
        </span>
      </button>
    </li>
  );
}

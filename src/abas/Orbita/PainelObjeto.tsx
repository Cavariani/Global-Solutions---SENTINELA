// Painel lateral com os dados do objeto selecionado · desliza da direita.
import { CAMADA_POR_GRUPO } from '@/constantes/camadas';
import type { GrupoCelesTrak } from '@/constantes/grupos';
import { TEXTOS } from '@/constantes/textos';
import {
  formatarAltitude,
  formatarNumero,
  formatarVelocidade,
} from '@/utils/formatadores';
import type { ObjetoOrbital } from '@/tipos/orbital';

interface PropsPainelObjeto {
  objeto: ObjetoOrbital | null;
  aoFechar: () => void;
}

export function PainelObjeto({ objeto, aoFechar }: PropsPainelObjeto) {
  const aberto = objeto !== null;
  const camada = objeto ? CAMADA_POR_GRUPO[objeto.grupo as GrupoCelesTrak] : null;

  return (
    <aside
      className={[
        'pointer-events-auto absolute right-0 top-0 z-40 h-full w-80 max-w-[88vw]',
        'border-l border-borda bg-fundo-secundario/90 backdrop-blur-md',
        'transition-transform duration-300 ease-out',
        aberto ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {objeto && camada && (
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-6 pt-24">
          {/* Cabeçalho */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide"
                style={{
                  color: camada.cor,
                  backgroundColor: `${camada.cor}1f`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: camada.cor }}
                />
                {camada.rotulo}
              </span>
              <h2 className="mt-2 break-words font-titulo text-xl text-texto-destaque">
                {objeto.nome}
              </h2>
              <p className="font-mono text-xs text-texto-secundario">
                NORAD {objeto.noradId}
              </p>
            </div>
            <button
              onClick={aoFechar}
              aria-label="Fechar"
              className="shrink-0 rounded-md border border-borda px-2 py-1 font-mono text-texto-secundario transition-colors hover:border-primaria hover:text-primaria"
            >
              ✕
            </button>
          </div>

          <p className="mb-5 rounded-md border border-borda/60 bg-fundo-principal/40 px-3 py-2 text-xs text-texto-secundario">
            {camada.contexto}
          </p>

          {/* Dados orbitais */}
          <dl className="flex flex-col divide-y divide-borda/50">
            <LinhaDado rotulo="Altitude" valor={formatarAltitude(objeto.altitudeKm)} />
            <LinhaDado rotulo="Faixa orbital" valor={objeto.faixaOrbital} />
            <LinhaDado
              rotulo="Velocidade"
              valor={formatarVelocidade(objeto.velocidadeKmS)}
            />
            <LinhaDado
              rotulo="Inclinação"
              valor={`${objeto.inclinacaoGraus.toFixed(2).replace('.', ',')}°`}
            />
            <LinhaDado
              rotulo="Período orbital"
              valor={`${formatarNumero(objeto.periodoMin)} min`}
            />
            <LinhaDado
              rotulo="Latitude"
              valor={`${objeto.latitude.toFixed(2).replace('.', ',')}°`}
            />
            <LinhaDado
              rotulo="Longitude"
              valor={`${objeto.longitude.toFixed(2).replace('.', ',')}°`}
            />
          </dl>

          {/* Indicador da trajetória desenhada no globo */}
          <div
            className="mt-4 flex items-center gap-2 rounded-md border px-3 py-2"
            style={{
              borderColor: `${camada.cor}40`,
              backgroundColor: `${camada.cor}10`,
            }}
          >
            <span
              className="h-2.5 w-6 shrink-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${camada.cor})`,
              }}
            />
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-texto-secundario">
              {TEXTOS.objeto.trajetoriaAtiva}
            </span>
          </div>

          {/* TLE bruto */}
          <details className="mt-5 rounded-md border border-borda/60 bg-fundo-principal/40">
            <summary className="cursor-pointer px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wide text-texto-secundario">
              Dados TLE
            </summary>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all px-3 pb-3 font-mono text-[0.6rem] leading-relaxed text-texto-secundario">
              {objeto.tle.linha1}
              {'\n'}
              {objeto.tle.linha2}
            </pre>
          </details>
        </div>
      )}
    </aside>
  );
}

function LinhaDado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-texto-secundario">
        {rotulo}
      </dt>
      <dd className="font-mono text-sm tabular-nums text-texto-principal">
        {valor}
      </dd>
    </div>
  );
}

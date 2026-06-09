// Painel de Análise de Risco · canto superior esquerdo da aba ÓRBITA.
// Roda o motor de conjunções (SGP4) sobre as posições atuais e lista as
// aproximações mais perigosas. É a função que eleva o SENTINELA de
// "visualização" para "apoio à decisão": o mesmo alerta que operadores de
// satélite usam para decidir manobras de desvio.
import { useState } from 'react';
import { CAMADA_POR_GRUPO } from '@/constantes/camadas';
import type { GrupoCelesTrak } from '@/constantes/grupos';
import { TEXTOS } from '@/constantes/textos';
import { formatarNumero } from '@/utils/formatadores';
import type { ResultadoAnalise } from '@/utils/conjuncoes';
import type { Conjuncao, NivelRisco } from '@/tipos/orbital';

interface PropsPainelConjuncoes {
  resultado: ResultadoAnalise | null;
  analisando: boolean;
  conjuncaoDestacada: Conjuncao | null;
  aoAnalisar: () => void;
  aoSelecionar: (conjuncao: Conjuncao | null) => void;
}

// Cor de cada nível de risco.
const COR_NIVEL: Record<NivelRisco, string> = {
  critico: '#ff1744',
  alto: '#ff5722',
  moderado: '#ffab00',
};

export function PainelConjuncoes({
  resultado,
  analisando,
  conjuncaoDestacada,
  aoAnalisar,
  aoSelecionar,
}: PropsPainelConjuncoes) {
  const [aberto, setAberto] = useState(true);
  const { conjuncoes: textos } = TEXTOS;

  return (
    <div className="pointer-events-auto absolute left-6 top-28 z-30 w-72 max-w-[calc(100vw-3rem)]">
      <div className="cantoneiras relative overflow-hidden rounded-lg border border-alerta/30 bg-fundo-secundario/85 shadow-glow-alerta backdrop-blur-md">
        {/* Cabeçalho */}
        <button
          onClick={() => setAberto((a) => !a)}
          className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-fundo-elevado/50"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-alerta pulso-status" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-alerta">
              {textos.titulo}
            </span>
          </span>
          <span className="font-mono text-xs text-texto-secundario">
            {aberto ? '–' : '+'}
          </span>
        </button>

        {aberto && (
          <div className="border-t border-borda/60 px-4 pb-4 pt-3">
            <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-texto-secundario">
              {textos.subtitulo}
            </p>

            {/* Botão de análise */}
            <button
              onClick={aoAnalisar}
              disabled={analisando}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-alerta/50 bg-alerta/10 px-3 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-alerta transition-all hover:border-alerta hover:bg-alerta/20 hover:shadow-glow-alerta disabled:cursor-wait disabled:opacity-60"
            >
              {analisando ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-alerta/40 border-t-alerta" />
                  {textos.analisando}
                </>
              ) : (
                <>
                  <span aria-hidden>⚠</span>
                  {resultado ? textos.reanalisar : textos.analisar}
                </>
              )}
            </button>

            {/* Resultado */}
            {resultado && !analisando && (
              <div className="mt-4">
                {/* Resumo */}
                <div className="grid grid-cols-3 gap-2 border-y border-borda/60 py-3">
                  <Metrica
                    rotulo={textos.encontradas}
                    valor={formatarNumero(resultado.conjuncoes.length)}
                    cor="text-alerta"
                  />
                  <Metrica
                    rotulo={textos.criticas}
                    valor={formatarNumero(resultado.criticas)}
                    cor="text-[#ff1744]"
                  />
                  <Metrica
                    rotulo={textos.totalAnalisado}
                    valor={formatarNumero(resultado.totalAnalisado)}
                    cor="text-primaria"
                  />
                </div>

                {/* Lista de conjunções */}
                {resultado.conjuncoes.length === 0 ? (
                  <p className="mt-3 text-xs leading-relaxed text-texto-secundario">
                    {textos.nenhuma}
                  </p>
                ) : (
                  <>
                    <ul className="mt-3 max-h-[38vh] space-y-1.5 overflow-y-auto pr-1">
                      {resultado.conjuncoes.map((conjuncao) => (
                        <ItemConjuncao
                          key={conjuncao.id}
                          conjuncao={conjuncao}
                          destacada={
                            conjuncaoDestacada?.id === conjuncao.id
                          }
                          aoClicar={() =>
                            aoSelecionar(
                              conjuncaoDestacada?.id === conjuncao.id
                                ? null
                                : conjuncao,
                            )
                          }
                        />
                      ))}
                    </ul>
                    {conjuncaoDestacada && (
                      <button
                        onClick={() => aoSelecionar(null)}
                        className="mt-2 w-full font-mono text-[0.6rem] uppercase tracking-[0.12em] text-texto-secundario transition-colors hover:text-alerta"
                      >
                        {textos.fechar}
                      </button>
                    )}
                    <p className="mt-3 text-[0.65rem] leading-relaxed text-texto-secundario">
                      {textos.explicacao}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Metrica({
  rotulo,
  valor,
  cor,
}: {
  rotulo: string;
  valor: string;
  cor: string;
}) {
  return (
    <div className="text-center">
      <span className={`block font-mono text-lg font-medium tabular-nums ${cor}`}>
        {valor}
      </span>
      <span className="mt-0.5 block font-mono text-[0.5rem] uppercase leading-tight tracking-[0.1em] text-texto-secundario">
        {rotulo}
      </span>
    </div>
  );
}

interface PropsItemConjuncao {
  conjuncao: Conjuncao;
  destacada: boolean;
  aoClicar: () => void;
}

function ItemConjuncao({ conjuncao, destacada, aoClicar }: PropsItemConjuncao) {
  const corNivel = COR_NIVEL[conjuncao.nivel];
  const camadaA = CAMADA_POR_GRUPO[conjuncao.a.grupo as GrupoCelesTrak];
  const camadaB = CAMADA_POR_GRUPO[conjuncao.b.grupo as GrupoCelesTrak];

  return (
    <li>
      <button
        onClick={aoClicar}
        className={[
          'w-full rounded-md border px-2.5 py-2 text-left transition-all',
          destacada
            ? 'border-alerta bg-alerta/15 shadow-glow-alerta'
            : 'border-borda/50 bg-fundo-principal/30 hover:border-alerta/50 hover:bg-fundo-elevado/40',
        ].join(' ')}
      >
        {/* Topo: nível + separação */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.1em]"
            style={{ color: corNivel, backgroundColor: `${corNivel}22` }}
          >
            {TEXTOS.conjuncoes.niveis[conjuncao.nivel]}
          </span>
          <span
            className="font-mono text-sm font-medium tabular-nums"
            style={{ color: corNivel }}
          >
            {formatarSeparacao(conjuncao.distanciaKm)}
          </span>
        </div>

        {/* Os dois objetos */}
        <div className="mt-1.5 space-y-0.5">
          <ObjetoLinha nome={conjuncao.a.nome} cor={camadaA?.cor} />
          <ObjetoLinha nome={conjuncao.b.nome} cor={camadaB?.cor} />
        </div>

        {/* Rodapé: velocidade relativa + altitude */}
        <div className="mt-1.5 flex items-center justify-between font-mono text-[0.6rem] text-texto-secundario">
          <span>
            {conjuncao.velocidadeRelativaKmS.toFixed(1).replace('.', ',')} km/s
          </span>
          <span>{formatarNumero(conjuncao.altitudeKm)} km</span>
        </div>
      </button>
    </li>
  );
}

function ObjetoLinha({ nome, cor }: { nome: string; cor?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: cor ?? '#8899aa' }}
      />
      <span className="truncate text-[0.72rem] text-texto-principal">{nome}</span>
    </div>
  );
}

// "0,42 km" para curtas; "7 km" para maiores.
function formatarSeparacao(km: number): string {
  if (km < 10) return `${km.toFixed(2).replace('.', ',')} km`;
  return `${formatarNumero(km)} km`;
}

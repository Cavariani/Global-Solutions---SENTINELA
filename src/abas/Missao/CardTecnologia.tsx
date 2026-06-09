// Card expansível de uma tecnologia de remoção de detritos.
// Comportamento: clique no cabeçalho expande/recolhe o corpo, com detalhes
// de princípio, missão associada, maturidade (TRL) e desafio técnico.

interface PropsCardTecnologia {
  codigo: string;
  nome: string;
  missao?: string;
  principio: string;
  maturidade: string;
  desafio: string;
  aberto: boolean;
  aoAlternar: () => void;
}

export function CardTecnologia({
  codigo,
  nome,
  missao,
  principio,
  maturidade,
  desafio,
  aberto,
  aoAlternar,
}: PropsCardTecnologia) {
  return (
    <article
      className={[
        'overflow-hidden rounded-lg border bg-fundo-secundario/70 backdrop-blur-md transition-all duration-300',
        aberto
          ? 'border-primaria shadow-glow-primaria'
          : 'border-borda hover:border-primaria/50',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={aoAlternar}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-fundo-elevado/40"
        aria-expanded={aberto}
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="shrink-0 rounded border border-primaria-dim px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primaria">
            {codigo}
          </span>
          <h3 className="truncate font-titulo text-lg font-semibold text-texto-destaque sm:text-xl">
            {nome}
          </h3>
        </div>
        <span
          className={[
            'shrink-0 font-mono text-lg text-primaria transition-transform duration-300',
            aberto ? 'rotate-45' : '',
          ].join(' ')}
          aria-hidden
        >
          +
        </span>
      </button>

      {aberto && (
        <div className="grid gap-6 border-t border-borda/60 px-5 py-5 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-texto-secundario">
              Princípio
            </p>
            <p className="mt-2 text-sm leading-relaxed text-texto-principal">
              {principio}
            </p>
          </div>
          <div className="space-y-4">
            {missao && (
              <Linha rotulo="Missão de referência" valor={missao} />
            )}
            <Linha rotulo="Maturidade" valor={maturidade} acento />
            <Linha rotulo="Principal desafio" valor={desafio} />
          </div>
        </div>
      )}
    </article>
  );
}

function Linha({
  rotulo,
  valor,
  acento,
}: {
  rotulo: string;
  valor: string;
  acento?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-texto-secundario">
        {rotulo}
      </p>
      <p
        className={[
          'mt-1 text-sm leading-relaxed',
          acento ? 'font-mono text-primaria' : 'text-texto-principal',
        ].join(' ')}
      >
        {valor}
      </p>
    </div>
  );
}

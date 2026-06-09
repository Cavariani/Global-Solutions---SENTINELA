// Card de uma solução/iniciativa real contra os detritos orbitais.

interface PropsCardSolucao {
  icone: string;
  titulo: string;
  descricao: string;
  marcador: string;
}

export function CardSolucao({ icone, titulo, descricao, marcador }: PropsCardSolucao) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-borda bg-fundo-secundario/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-primaria hover:shadow-glow-primaria">
      <div className="flex items-start justify-between gap-4">
        <span className="text-4xl" aria-hidden>
          {icone}
        </span>
        <span className="rounded-full border border-primaria-dim px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primaria">
          {marcador}
        </span>
      </div>
      <h3 className="mt-5 font-titulo text-xl font-semibold text-texto-destaque">
        {titulo}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-texto-secundario">
        {descricao}
      </p>
    </article>
  );
}

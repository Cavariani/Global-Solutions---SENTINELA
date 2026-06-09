// Linha do tempo vertical com marcos do esforço internacional para
// remediar o problema dos detritos orbitais.

interface ItemLinhaTempo {
  ano: string;
  titulo: string;
  detalhe: string;
}

interface PropsLinhaTempo {
  itens: readonly ItemLinhaTempo[];
}

export function LinhaTempo({ itens }: PropsLinhaTempo) {
  return (
    <ol className="relative mt-10 space-y-8 border-l-2 border-acento/50 pl-8">
      {itens.map((item) => (
        <li key={item.ano} className="relative">
          <span
            aria-hidden
            className="absolute -left-[37px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primaria bg-fundo-principal shadow-glow-primaria"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primaria" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primaria">
            {item.ano}
          </p>
          <h3 className="mt-1 font-titulo text-lg font-semibold text-texto-destaque">
            {item.titulo}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-texto-secundario">
            {item.detalhe}
          </p>
        </li>
      ))}
    </ol>
  );
}

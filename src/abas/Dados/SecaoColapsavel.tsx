// Bloco colapsável para a aba DADOS. Cabeçalho com código, título e legenda,
// corpo que esconde/mostra com animação suave. Layout em duas colunas opcional
// para um cartão de "destaque numérico" lado a lado com o gráfico.
import { useState, type ReactNode } from 'react';

interface DestaqueNumerico {
  rotulo: string;
  valor: string;
  descricao: string;
}

interface PropsSecaoColapsavel {
  codigo: string;
  titulo: string;
  legenda: string;
  destaque?: DestaqueNumerico;
  inicialAberto?: boolean;
  children: ReactNode;
}

export function SecaoColapsavel({
  codigo,
  titulo,
  legenda,
  destaque,
  inicialAberto = false,
  children,
}: PropsSecaoColapsavel) {
  const [aberto, setAberto] = useState(inicialAberto);

  return (
    <article
      className={[
        'overflow-hidden rounded-xl border bg-fundo-secundario/60 backdrop-blur-md transition-all duration-500',
        aberto
          ? 'border-primaria/50 shadow-glow-primaria'
          : 'border-borda hover:border-primaria/30',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-fundo-elevado/30"
      >
        <div className="flex min-w-0 items-start gap-5">
          <span className="mt-1 shrink-0 rounded border border-primaria-dim px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-primaria">
            {codigo}
          </span>
          <div className="min-w-0">
            <h3 className="font-titulo text-lg font-semibold text-texto-destaque sm:text-xl">
              {titulo}
            </h3>
            <p className="mt-1 text-sm text-texto-secundario">{legenda}</p>
          </div>
        </div>
        <span
          aria-hidden
          className={[
            'shrink-0 font-mono text-2xl text-primaria/80 transition-transform duration-500',
            aberto ? 'rotate-45' : '',
          ].join(' ')}
        >
          +
        </span>
      </button>

      <div
        className={[
          'grid transition-all duration-500 ease-out',
          aberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div className="border-t border-borda/60 px-6 py-6">
            {destaque ? (
              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <div>{children}</div>
                <aside className="rounded-lg border border-primaria/30 bg-fundo-elevado/30 p-5">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primaria">
                    {destaque.rotulo}
                  </p>
                  <p className="mt-2 font-titulo text-4xl font-bold text-texto-destaque">
                    {destaque.valor}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-texto-secundario">
                    {destaque.descricao}
                  </p>
                </aside>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

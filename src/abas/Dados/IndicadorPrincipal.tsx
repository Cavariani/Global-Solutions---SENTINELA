// Card de KPI destacado no topo da aba DADOS. Tom muda entre primaria e alerta.

interface PropsIndicador {
  rotulo: string;
  valor: string;
  contexto: string;
  tom: 'primaria' | 'alerta';
}

export function IndicadorPrincipal({ rotulo, valor, contexto, tom }: PropsIndicador) {
  const corValor = tom === 'alerta' ? 'text-alerta' : 'text-primaria';
  const corBorda =
    tom === 'alerta'
      ? 'border-alerta/30 hover:border-alerta/70 hover:shadow-glow-alerta'
      : 'border-primaria/30 hover:border-primaria/70 hover:shadow-glow-primaria';

  return (
    <article
      className={[
        'group relative overflow-hidden rounded-lg border bg-fundo-secundario/60 p-5 backdrop-blur-md transition-all duration-300',
        corBorda,
      ].join(' ')}
    >
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-texto-secundario">
        {rotulo}
      </p>
      <p
        className={[
          'mt-3 font-titulo text-3xl font-bold tabular-nums sm:text-4xl',
          corValor,
        ].join(' ')}
      >
        {valor}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-texto-secundario">{contexto}</p>
      {/* Brilho lateral no hover */}
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute inset-y-0 left-0 w-px opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          tom === 'alerta' ? 'bg-alerta' : 'bg-primaria',
        ].join(' ')}
      />
    </article>
  );
}

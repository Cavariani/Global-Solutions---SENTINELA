// Pill de filtro reutilizável · usado no seletor de faixa orbital.
import type { ReactNode } from 'react';

interface PropsBotaoFiltro {
  ativo: boolean;
  aoClicar: () => void;
  children: ReactNode;
}

export function BotaoFiltro({ ativo, aoClicar, children }: PropsBotaoFiltro) {
  return (
    <button
      onClick={aoClicar}
      className={[
        'rounded-md px-3 py-1.5 font-mono text-xs tracking-wide transition-all',
        ativo
          ? 'bg-primaria/15 text-primaria shadow-glow-primaria ring-1 ring-primaria/50'
          : 'text-texto-secundario hover:bg-fundo-elevado hover:text-texto-principal',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

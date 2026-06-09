// Barra de navegação. Wordmark central + abas com underline animado.
// Estética: HUD de centro de controle, com brilho frio e linhas finas.
// Some completamente enquanto a intro cinematográfica está rodando.
import { NavLink } from 'react-router-dom';
import { TEXTOS } from '@/constantes/textos';
import { useIntro } from '@/estado/IntroContexto';

const ABAS = [
  { caminho: '/orbita', rotulo: TEXTOS.navegacao.orbita, codigo: '01' },
  { caminho: '/crise', rotulo: TEXTOS.navegacao.crise, codigo: '02' },
  { caminho: '/missao', rotulo: TEXTOS.navegacao.missao, codigo: '03' },
  { caminho: '/dados', rotulo: TEXTOS.navegacao.dados, codigo: '04' },
];

export function Navegacao() {
  const { introAtiva } = useIntro();

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out',
        introAtiva
          ? 'pointer-events-none -translate-y-full opacity-0'
          : 'translate-y-0 opacity-100',
      ].join(' ')}
      aria-hidden={introAtiva}
    >
      {/* Painel translúcido com vidro fosco */}
      <div className="border-b border-primaria/10 bg-fundo-principal/40 backdrop-blur-2xl">
        {/* Linha de varredura no topo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primaria/70 to-transparent" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 sm:px-10">
          {/* Wordmark esquerda */}
          <NavLink
            to="/orbita"
            className="group flex items-center gap-3"
            aria-label={TEXTOS.marca.nome}
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primaria/70">
              SNL
            </span>
            <span className="hidden h-4 w-px bg-primaria/30 sm:block" />
            <span className="marca-sentinela font-marca text-xl font-bold tracking-[0.45em] sm:text-2xl">
              {TEXTOS.marca.nome}
            </span>
          </NavLink>

          {/* Abas direita */}
          <ul className="flex items-center gap-1 sm:gap-3">
            {ABAS.map((aba) => (
              <li key={aba.caminho}>
                <NavLink to={aba.caminho} className="group relative block">
                  {({ isActive }) => (
                    <span
                      className={[
                        'relative flex items-center gap-2 px-2.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-300 sm:px-3 sm:text-xs',
                        isActive
                          ? 'text-primaria'
                          : 'text-texto-secundario/80 group-hover:text-texto-destaque',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'hidden text-[0.55rem] tabular-nums sm:inline',
                          isActive ? 'text-primaria/80' : 'text-texto-secundario/40',
                        ].join(' ')}
                        aria-hidden
                      >
                        {aba.codigo}
                      </span>
                      <span>{aba.rotulo}</span>
                      {/* Underline animado */}
                      <span
                        className={[
                          'pointer-events-none absolute -bottom-1 left-1/2 h-px -translate-x-1/2 transition-all duration-500 ease-out',
                          isActive
                            ? 'w-full bg-primaria shadow-[0_0_8px_rgba(79,195,247,0.7)]'
                            : 'w-0 bg-primaria/60 group-hover:w-3/4',
                        ].join(' ')}
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

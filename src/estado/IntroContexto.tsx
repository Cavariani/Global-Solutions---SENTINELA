// Estado global da intro cinematográfica. A aba ÓRBITA é quem controla,
// mas a navegação topo precisa saber para se ocultar enquanto a intro roda.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface IntroContexto {
  introAtiva: boolean;
  iniciarIntro: () => void;
  encerrarIntro: () => void;
}

const Contexto = createContext<IntroContexto | null>(null);

// Flag de módulo: a intro deve rodar uma única vez por carga da página.
// Refresh recarrega o módulo e a intro volta a aparecer.
let introJaExibida = false;

export function ProvedorIntro({ children }: { children: ReactNode }) {
  const [introAtiva, setIntroAtiva] = useState(() => !introJaExibida);

  const valor = useMemo<IntroContexto>(
    () => ({
      introAtiva,
      iniciarIntro: () => {
        introJaExibida = false;
        setIntroAtiva(true);
      },
      encerrarIntro: () => {
        introJaExibida = true;
        setIntroAtiva(false);
      },
    }),
    [introAtiva],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useIntro(): IntroContexto {
  const ctx = useContext(Contexto);
  if (!ctx) {
    throw new Error('useIntro deve ser usado dentro de <ProvedorIntro>');
  }
  return ctx;
}

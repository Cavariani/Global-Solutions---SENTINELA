// Envolve uma aba e faz uma entrada suave (fade + leve subida) ao montar.
// Dá à navegação um acabamento premium. Ao fim, limpa o transform inline para
// não criar containing block (evita interferir em position: fixed das filhas).
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface PropsTransicaoPagina {
  children: ReactNode;
}

export function TransicaoPagina({ children }: PropsTransicaoPagina) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    const animacao = gsap.fromTo(
      elemento,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform',
      },
    );
    return () => {
      animacao.kill();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

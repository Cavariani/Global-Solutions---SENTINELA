// Capítulo 4 da CRISE · o que você perderia. Grid de ícones que "apagam" no scroll.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

export function CapituloPerda() {
  const raizRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      gsap.from('.perda-texto', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });

      // Os cards entram acesos e, em seguida, "apagam" (esmaecem) em cascata.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: raiz, start: 'top 45%', once: true },
      });
      tl.from('.perda-item', {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.6)',
      }).to(
        '.perda-item',
        {
          opacity: 0.25,
          filter: 'grayscale(1)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.in',
        },
        '+=0.6',
      );
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { cap4 } = TEXTOS.crise;

  return (
    <section
      ref={raizRef}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="perda-texto font-mono text-xs uppercase tracking-[0.3em] text-alerta">
        {cap4.rotulo}
      </p>
      <h2 className="perda-texto mt-5 max-w-3xl font-titulo text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-tight text-texto-destaque">
        {cap4.titulo}
      </h2>
      <p className="perda-texto mt-4 max-w-xl text-lg leading-relaxed text-texto-secundario">
        {cap4.legenda}
      </p>

      <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
        {cap4.itens.map((item) => (
          <div
            key={item.nome}
            className="perda-item flex flex-col items-center rounded-lg border border-borda bg-fundo-secundario/70 px-4 py-6"
          >
            <span className="text-4xl" aria-hidden>
              {item.icone}
            </span>
            <span className="mt-3 font-titulo text-base font-semibold text-texto-destaque">
              {item.nome}
            </span>
            <span className="mt-1 font-mono text-[0.7rem] text-texto-secundario">
              {item.detalhe}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

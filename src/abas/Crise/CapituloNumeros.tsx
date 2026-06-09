// Capítulo 1 da CRISE · o número-choque, com counter animado por ScrollTrigger.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FRAGMENTOS } from '@/constantes/estatisticas';
import { formatarNumero } from '@/utils/formatadores';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

export function CapituloNumeros() {
  const raizRef = useRef<HTMLElement | null>(null);
  const contadorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const contador = contadorRef.current;
    if (!raiz || !contador) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      const alvo = { valor: 0 };
      gsap.to(alvo, {
        valor: FRAGMENTOS.entre1mmE1cm,
        duration: 2.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: raiz, start: 'top 65%', once: true },
        onUpdate: () => {
          contador.textContent = formatarNumero(alvo.valor);
        },
      });

      gsap.from('.numeros-texto', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { cap1 } = TEXTOS.crise;

  return (
    <section
      ref={raizRef}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p className="numeros-texto font-mono text-xs uppercase tracking-[0.3em] text-alerta">
        {cap1.rotulo}
      </p>
      <span
        ref={contadorRef}
        className="mt-6 font-titulo text-[clamp(3rem,12vw,9rem)] font-bold leading-none text-texto-destaque tabular-nums"
      >
        0
      </span>
      <h2 className="numeros-texto mt-2 font-titulo text-[clamp(1.5rem,4vw,3rem)] font-bold text-alerta">
        {cap1.titulo}
      </h2>
      <p className="numeros-texto mt-6 max-w-xl text-lg leading-relaxed text-texto-secundario">
        {cap1.legenda}
      </p>
    </section>
  );
}

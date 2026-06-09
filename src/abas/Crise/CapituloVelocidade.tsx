// Capítulo 2 da CRISE · a velocidade, com barras comparativas animadas.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

// Larguras relativas das barras (bala de rifle vs detrito orbital).
const BARRAS = [
  { rotulo: 'Bala de rifle', velocidade: '3.600 km/h', largura: 13, cor: 'bg-primaria' },
  { rotulo: 'Detrito orbital', velocidade: '27.000 km/h', largura: 100, cor: 'bg-alerta' },
];

export function CapituloVelocidade() {
  const raizRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      gsap.from('.velocidade-texto', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });

      gsap.from('.velocidade-barra', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.25,
        scrollTrigger: { trigger: raiz, start: 'top 55%', once: true },
      });
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { cap2 } = TEXTOS.crise;

  return (
    <section
      ref={raizRef}
      className="flex min-h-screen flex-col justify-center px-6"
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className="velocidade-texto font-mono text-xs uppercase tracking-[0.3em] text-alerta">
          {cap2.rotulo}
        </p>
        <h2 className="velocidade-texto mt-5 font-titulo text-[clamp(1.8rem,5vw,3.6rem)] font-bold leading-tight text-texto-destaque">
          {cap2.titulo}
        </h2>

        <div className="mt-12 space-y-7">
          {BARRAS.map((barra) => (
            <div key={barra.rotulo} className="velocidade-texto">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-titulo text-sm text-texto-principal">{barra.rotulo}</span>
                <span className="font-mono text-sm text-texto-secundario">{barra.velocidade}</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-fundo-elevado">
                <div
                  className={`velocidade-barra h-full rounded-full ${barra.cor}`}
                  style={{ width: `${barra.largura}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="velocidade-texto mt-10 max-w-xl text-lg leading-relaxed text-texto-secundario">
          {cap2.legenda}
        </p>
      </div>
    </section>
  );
}

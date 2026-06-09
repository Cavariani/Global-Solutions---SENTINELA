// Capítulo 3 da CRISE · Efeito Kessler, com diagrama SVG de cascata animado.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CORES } from '@/constantes/cores';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

// Cascata: 1 colisão → 2 → 4 → 8 nós, em colunas sucessivas.
const COLUNAS = [
  [{ x: 60, y: 130 }],
  [
    { x: 170, y: 80 },
    { x: 170, y: 180 },
  ],
  [
    { x: 280, y: 45 },
    { x: 280, y: 105 },
    { x: 280, y: 155 },
    { x: 280, y: 215 },
  ],
  [
    { x: 390, y: 25 },
    { x: 390, y: 70 },
    { x: 390, y: 110 },
    { x: 390, y: 150 },
    { x: 390, y: 190 },
    { x: 390, y: 235 },
  ],
];

// Conexões entre colunas consecutivas (cada nó liga aos da coluna seguinte mais próximos).
const LIGACOES: { x1: number; y1: number; x2: number; y2: number }[] = [];
for (let c = 0; c < COLUNAS.length - 1; c += 1) {
  COLUNAS[c].forEach((origem) => {
    COLUNAS[c + 1].forEach((destino) => {
      LIGACOES.push({ x1: origem.x, y1: origem.y, x2: destino.x, y2: destino.y });
    });
  });
}

export function CapituloKessler() {
  const raizRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      gsap.from('.kessler-texto', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: raiz, start: 'top 50%', once: true },
      });
      tl.from('.kessler-no', {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: 0.06,
      }).from(
        '.kessler-linha',
        { opacity: 0, duration: 0.4, stagger: 0.02 },
        0.2,
      );

      gsap.from('.kessler-etapa', {
        opacity: 0,
        x: -20,
        duration: 0.7,
        stagger: 0.18,
        scrollTrigger: { trigger: raiz, start: 'top 45%', once: true },
      });
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { cap3 } = TEXTOS.crise;

  return (
    <section
      ref={raizRef}
      className="flex min-h-screen flex-col justify-center px-6"
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        {/* Texto */}
        <div>
          <p className="kessler-texto font-mono text-xs uppercase tracking-[0.3em] text-alerta">
            {cap3.rotulo}
          </p>
          <h2 className="kessler-texto mt-5 font-titulo text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-tight text-texto-destaque">
            {cap3.titulo}
          </h2>
          <p className="kessler-texto mt-5 text-lg leading-relaxed text-texto-secundario">
            {cap3.legenda}
          </p>

          <ol className="mt-8 space-y-3">
            {cap3.etapas.map((etapa, indice) => (
              <li key={etapa} className="kessler-etapa flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-alerta font-mono text-xs text-alerta">
                  {indice + 1}
                </span>
                <span className="text-sm text-texto-principal">{etapa}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Diagrama SVG da cascata */}
        <svg viewBox="0 0 450 260" className="w-full" role="img" aria-label="Diagrama da cascata de colisões">
          {LIGACOES.map((l, i) => (
            <line
              key={`linha-${i}`}
              className="kessler-linha"
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={CORES.alerta}
              strokeOpacity={0.25}
              strokeWidth={1}
            />
          ))}
          {COLUNAS.flat().map((no, i) => (
            <circle
              key={`no-${i}`}
              className="kessler-no"
              cx={no.x}
              cy={no.y}
              r={6}
              fill={i === 0 ? CORES.textoDestaque : CORES.alerta}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

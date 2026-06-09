// Capítulo 5 da CRISE. Linha do tempo cinematográfica dos eventos reais
// de fragmentação orbital. Layout vertical com trilho central pulsante,
// cards alternando lados em telas largas e empilhados em mobile.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVENTOS_FRAGMENTACAO } from '@/constantes/estatisticas';
import { formatarNumero } from '@/utils/formatadores';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

const ROTULO_TIPO: Record<string, string> = {
  asat: 'TESTE ANTISSATÉLITE',
  colisao: 'COLISÃO ORBITAL',
  explosao: 'EXPLOSÃO DE ESTÁGIO',
};

export function CapituloEventos() {
  const raizRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      gsap.from('.eventos-texto', {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: { trigger: raiz, start: 'top 65%', once: true },
      });

      gsap.from('.eventos-item', {
        opacity: 0,
        y: 48,
        duration: 1,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });

      gsap.from('.eventos-trilha', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.6,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: raiz, start: 'top 60%', once: true },
      });
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { cap5 } = TEXTOS.crise;

  return (
    <section
      ref={raizRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="eventos-texto font-mono text-xs uppercase tracking-[0.3em] text-alerta">
          {cap5.rotulo}
        </p>
        <h2 className="eventos-texto mt-5 font-titulo text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-tight text-texto-destaque">
          {cap5.titulo}
        </h2>
        <p className="eventos-texto mt-4 max-w-2xl text-lg leading-relaxed text-texto-secundario">
          {cap5.legenda}
        </p>

        {/* Timeline vertical */}
        <ol className="relative mt-16 flex flex-col gap-12 md:gap-16">
          {/* Trilho central */}
          <span
            aria-hidden
            className="eventos-trilha pointer-events-none absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-alerta/0 via-alerta/60 to-alerta/0 md:left-1/2 md:-translate-x-1/2"
          />

          {EVENTOS_FRAGMENTACAO.map((evento, i) => {
            const ladoEsquerdo = i % 2 === 0;
            return (
              <li
                key={evento.titulo}
                className="eventos-item relative grid md:grid-cols-2 md:gap-12"
              >
                {/* Ponto central pulsante */}
                <span
                  aria-hidden
                  className="absolute left-4 top-2 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2"
                >
                  <span className="absolute h-4 w-4 animate-ping rounded-full bg-alerta/40" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-alerta shadow-[0_0_18px_rgba(255,87,34,0.85)]" />
                </span>

                <CardEvento
                  ano={evento.ano}
                  titulo={evento.titulo}
                  descricao={evento.descricao}
                  detritos={evento.detritosGerados}
                  tipo={evento.tipo}
                  alinhamento={ladoEsquerdo ? 'esquerda' : 'direita'}
                />
              </li>
            );
          })}
        </ol>

        {/* Rodapé com soma total */}
        <RodapeImpacto />
      </div>
    </section>
  );
}

interface PropsCardEvento {
  ano: number;
  titulo: string;
  descricao: string;
  detritos: number;
  tipo: string;
  alinhamento: 'esquerda' | 'direita';
}

function CardEvento({
  ano,
  titulo,
  descricao,
  detritos,
  tipo,
  alinhamento,
}: PropsCardEvento) {
  const ehEsquerda = alinhamento === 'esquerda';
  return (
    <article
      className={[
        'ml-12 rounded-lg border border-alerta/25 bg-fundo-secundario/70 p-6 shadow-glow-alerta backdrop-blur-md transition-colors hover:border-alerta/60 md:ml-0',
        ehEsquerda
          ? 'md:col-start-1 md:row-start-1 md:text-right'
          : 'md:col-start-2 md:row-start-1',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-baseline gap-3',
          ehEsquerda ? 'md:justify-end' : '',
        ].join(' ')}
      >
        <span className="font-titulo text-4xl font-bold text-alerta">{ano}</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-alerta-hover">
          {ROTULO_TIPO[tipo] ?? tipo.toUpperCase()}
        </span>
      </div>
      <h3 className="mt-2 font-titulo text-xl font-semibold text-texto-destaque">
        {titulo}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-texto-secundario">
        {descricao}
      </p>
      <div
        className={[
          'mt-4 flex',
          ehEsquerda ? 'md:justify-end' : '',
        ].join(' ')}
      >
        <span className="rounded-full bg-alerta-dim px-3 py-1 font-mono text-xs text-alerta-hover">
          +{formatarNumero(detritos)} detritos gerados
        </span>
      </div>
    </article>
  );
}

function RodapeImpacto() {
  const total = EVENTOS_FRAGMENTACAO.reduce(
    (soma, evento) => soma + evento.detritosGerados,
    0,
  );
  return (
    <div className="eventos-item mt-16 rounded-lg border border-alerta/40 bg-alerta-dim/30 p-6 text-center backdrop-blur-md">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-alerta-hover">
        Soma dos quatro eventos
      </p>
      <p className="mt-2 font-titulo text-4xl font-bold text-alerta sm:text-5xl">
        +{formatarNumero(total)}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-texto-secundario">
        Detritos catalogados gerados em quatro eventos
      </p>
    </div>
  );
}

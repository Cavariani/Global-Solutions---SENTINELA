// Landing cinematográfica da aba ÓRBITA.
// Sequência longa e pausada: varredura, prosa, contadores e CTA, todos
// entrando em ritmo dramático. Dimensionada para caber em uma viewport
// padrão sem zoom (tipografia menor, espaçamento contido).
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { formatarNumero } from '@/utils/formatadores';
import { TEXTOS } from '@/constantes/textos';

interface PropsIntroAnimada {
  aoConcluir: () => void;
}

export function IntroAnimada({ aoConcluir }: PropsIntroAnimada) {
  const raizRef = useRef<HTMLDivElement | null>(null);
  const contadoresRef = useRef<(HTMLSpanElement | null)[]>([]);
  const concluidoRef = useRef(false);
  const [coordenadas, setCoordenadas] = useState({ lat: 0, lon: 0 });

  const finalizar = () => {
    if (concluidoRef.current) {
      return;
    }
    concluidoRef.current = true;
    const raiz = raizRef.current;
    if (!raiz) {
      aoConcluir();
      return;
    }
    // Saída cinematográfica longa antes de revelar o globo.
    gsap.to(raiz, {
      opacity: 0,
      duration: 1.4,
      ease: 'power2.inOut',
      onComplete: aoConcluir,
    });
  };

  // Leitura de coordenadas "ao vivo" · dá sensação de rastreamento contínuo.
  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setCoordenadas({
        lat: (Math.random() * 180 - 90),
        lon: (Math.random() * 360 - 180),
      });
    }, 1100);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) {
      return undefined;
    }

    const contexto = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .set('.intro-linha', { y: 56, opacity: 0, filter: 'blur(14px)' })
        .set('.intro-fade', { opacity: 0, y: 24 })
        .set('.intro-varredura', { xPercent: -120 })
        .set('.intro-vinheta', { opacity: 0 })
        // Vinheta abre lentamente
        .to('.intro-vinheta', { opacity: 1, duration: 1.6, ease: 'power2.out' })
        // Topo aparece com calma
        .from('.intro-topo', { opacity: 0, y: -14, duration: 1.2 }, '-=0.8')
        // Varredura horizontal lenta
        .to(
          '.intro-varredura',
          { xPercent: 120, duration: 3.2, ease: 'power2.inOut' },
          '-=0.6',
        )
        // Linhas do título, uma após outra, com peso dramático
        .to(
          '.intro-linha',
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 1.1,
            duration: 1.6,
          },
          '-=2.4',
        )
        // Bloco de prosa, contadores e CTA entram escalonados
        .to(
          '.intro-fade',
          { opacity: 1, y: 0, stagger: 0.45, duration: 1.1 },
          '-=0.6',
        )
        // Contadores sobem de 0 até o valor real, lentamente
        .add(() => {
          TEXTOS.intro.estatisticas.forEach((stat, i) => {
            const elemento = contadoresRef.current[i];
            if (!elemento) {
              return;
            }
            const alvo = { valor: 0 };
            gsap.to(alvo, {
              valor: stat.valor,
              duration: 3.0,
              ease: 'power2.out',
              onUpdate: () => {
                elemento.textContent = formatarNumero(alvo.valor) + stat.sufixo;
              },
            });
          });
        }, '-=0.5');
    }, raiz);

    return () => contexto.revert();
  }, []);

  const { intro } = TEXTOS;

  return (
    <div
      ref={raizRef}
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-fundo-principal"
    >
      {/* Atmosfera de fundo */}
      <div className="intro-vinheta absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,195,247,0.18),transparent_46%),radial-gradient(circle_at_75%_75%,rgba(255,87,34,0.12),transparent_36%)]" />
      <div className="intro-vinheta absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(79,195,247,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.07)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="intro-varredura absolute top-1/2 h-px w-full bg-primaria shadow-[0_0_38px_rgba(79,195,247,0.95)]" />

      {/* Cantoneiras de alvo */}
      <CornerBrackets />

      {/* Topo: eyebrow + versão */}
      <div className="intro-topo relative z-10 flex items-center justify-between px-6 pt-5 sm:px-10">
        <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primaria">
          <span className="h-1.5 w-1.5 rounded-full bg-primaria pulso-status" />
          {intro.eyebrow}
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-texto-secundario">
          {intro.versao}
        </span>
      </div>

      {/* Bloco central */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <div className="space-y-0">
            {intro.linhas.map((linha) => (
              <h1
                key={linha}
                className="intro-linha font-marca text-[clamp(1.8rem,6vw,5.2rem)] font-bold uppercase leading-[0.95] tracking-tight text-texto-destaque"
              >
                {linha}
              </h1>
            ))}
          </div>

          <p className="intro-fade mt-6 max-w-xl text-sm leading-relaxed text-texto-secundario sm:text-base">
            {intro.prosa}
          </p>

          {/* Contadores ao vivo */}
          <div className="intro-fade mt-6 grid max-w-2xl grid-cols-3 gap-4 border-y border-borda/60 py-4">
            {intro.estatisticas.map((stat, i) => (
              <div key={stat.rotulo}>
                <span
                  ref={(el) => {
                    contadoresRef.current[i] = el;
                  }}
                  className="block font-mono text-base font-medium tabular-nums text-primaria sm:text-xl"
                >
                  0
                </span>
                <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-texto-secundario">
                  {stat.rotulo}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="intro-fade mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={finalizar}
              className="group relative overflow-hidden rounded-md border border-primaria/60 bg-primaria/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primaria shadow-glow-primaria transition-all hover:border-primaria hover:text-fundo-principal sm:text-sm"
            >
              <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-primaria transition-transform duration-500 group-hover:scale-x-100" />
              <span className="relative z-10 flex items-center gap-2">
                {intro.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={finalizar}
              className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-texto-secundario transition-colors hover:text-texto-principal"
            >
              {intro.pular}
            </button>
          </div>
        </div>
      </div>

      {/* Rodapé: leitura de coordenadas ao vivo + assinatura acadêmica */}
      <div className="intro-fade relative z-10 flex flex-col items-center justify-between gap-1 px-6 pb-5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-texto-secundario sm:flex-row sm:items-center sm:px-10">
        <span className="tabular-nums">
          LAT {coordenadas.lat >= 0 ? '+' : ''}
          {coordenadas.lat.toFixed(3)}° · LON {coordenadas.lon >= 0 ? '+' : ''}
          {coordenadas.lon.toFixed(3)}°
        </span>
        <span className="text-center text-[0.55rem] tracking-[0.18em] text-texto-secundario/80">
          {TEXTOS.autor.assinatura} · {TEXTOS.autor.projeto}
        </span>
        <span className="hidden text-primaria sm:inline">{intro.chamada}</span>
      </div>
    </div>
  );
}

// Cantoneiras de "alvo" nos quatro cantos da tela.
function CornerBrackets() {
  const base = 'pointer-events-none absolute h-8 w-8 border-primaria/50';
  return (
    <>
      <span className={`${base} left-4 top-4 border-l border-t`} />
      <span className={`${base} right-4 top-4 border-r border-t`} />
      <span className={`${base} bottom-4 left-4 border-b border-l`} />
      <span className={`${base} bottom-4 right-4 border-b border-r`} />
    </>
  );
}

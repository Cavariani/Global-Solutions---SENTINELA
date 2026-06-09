// Aba CRISE · storytelling guiado por scroll (GSAP ScrollTrigger).
// Cinco capítulos encadeados que constroem o argumento sobre os detritos orbitais.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CapituloNumeros } from './CapituloNumeros';
import { CapituloVelocidade } from './CapituloVelocidade';
import { CapituloKessler } from './CapituloKessler';
import { CapituloPerda } from './CapituloPerda';
import { CapituloEventos } from './CapituloEventos';
import { TEXTOS } from '@/constantes/textos';

gsap.registerPlugin(ScrollTrigger);

export default function Crise() {
  // A aba é lazy: ao montar, recalcula as posições dos ScrollTriggers para
  // alinhar os gatilhos com o layout já renderizado.
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((gatilho) => gatilho.kill());
    };
  }, []);

  const { crise, missao } = TEXTOS;

  return (
    <main className="bg-gradiente-fundo">
      {/* Abertura da seção */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-alerta">
          {crise.rotulo}
        </p>
        <h1 className="mt-5 max-w-3xl font-titulo text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[1.02] text-texto-destaque">
          {TEXTOS.marca.tagline}
        </h1>
        <p className="mt-6 font-mono text-sm text-texto-secundario">{crise.subtitulo}</p>
        <span className="mt-16 animate-bounce font-mono text-2xl text-primaria" aria-hidden>
          ↓
        </span>
      </section>

      <CapituloNumeros />
      <CapituloVelocidade />
      <CapituloKessler />
      <CapituloPerda />
      <CapituloEventos />

      {/* Transição para a MISSÃO · sai do tom catastrofista para o propositivo */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="max-w-2xl font-titulo text-[clamp(1.6rem,4vw,3rem)] font-bold text-texto-destaque">
          {missao.titulo}
        </h2>
        <Link
          to="/missao"
          className="mt-8 rounded-md border border-primaria bg-primaria-dim/30 px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-primaria transition-colors hover:bg-primaria-dim/60 hover:text-primaria-hover"
        >
          Ver a missão →
        </Link>
      </section>
    </main>
  );
}

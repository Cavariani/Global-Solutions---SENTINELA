// Aba DADOS. Dashboard cinematográfico com KPIs no topo, seções colapsáveis
// para cada gráfico, cards de fatos-chave e recursos públicos.
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GraficoCrescimento } from './GraficoCrescimento';
import { GraficoDistribuicao } from './GraficoDistribuicao';
import { GraficoPaises } from './GraficoPaises';
import { MapaCalor } from './MapaCalor';
import { IndicadorPrincipal } from './IndicadorPrincipal';
import { SecaoColapsavel } from './SecaoColapsavel';
import { EVENTOS_FRAGMENTACAO } from '@/constantes/estatisticas';
import { formatarNumero } from '@/utils/formatadores';
import { TEXTOS } from '@/constantes/textos';

export default function Dados() {
  const { dados } = TEXTOS;
  const raizRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const contexto = gsap.context(() => {
      gsap.from('.dados-entrada', {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from('.dados-kpi', {
        opacity: 0,
        y: 22,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, raiz);
    return () => contexto.revert();
  }, []);

  return (
    <main ref={raizRef} className="min-h-screen bg-gradiente-fundo px-6 pb-32 pt-28">
      {/* Atmosfera de grade técnica ao fundo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(rgba(79,195,247,1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,1)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="mx-auto max-w-6xl space-y-20">
        {/* Cabeçalho */}
        <header className="dados-entrada">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primaria shadow-[0_0_8px_rgba(79,195,247,0.9)]" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
              {dados.rotulo}
            </p>
            <span className="hidden h-px flex-1 bg-gradient-to-r from-primaria/40 to-transparent sm:block" />
            <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] text-texto-secundario sm:inline">
              {dados.chamadaAoVivo}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl font-titulo text-[clamp(2rem,5vw,4rem)] font-bold leading-tight text-texto-destaque">
            {dados.titulo}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto-secundario">
            {dados.subtitulo}
          </p>
        </header>

        {/* KPIs */}
        <section
          aria-label="Indicadores principais"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {dados.indicadores.map((indicador) => (
            <div key={indicador.rotulo} className="dados-kpi">
              <IndicadorPrincipal
                rotulo={indicador.rotulo}
                valor={indicador.valor}
                contexto={indicador.contexto}
                tom={indicador.tom as 'primaria' | 'alerta'}
              />
            </div>
          ))}
        </section>

        {/* Seções colapsáveis com cada gráfico */}
        <section className="space-y-4">
          <CabecalhoSecao
            codigo="§ DOSSIÊ"
            titulo="Cinco cortes sobre a órbita"
            descricao="Cada seção abaixo é uma forma diferente de olhar para o mesmo problema. Clique para expandir."
          />

          <SecaoColapsavel
            codigo="01"
            titulo={dados.crescimento.titulo}
            legenda={dados.crescimento.legenda}
            destaque={dados.crescimento.destaque}
            inicialAberto
          >
            <GraficoCrescimento />
          </SecaoColapsavel>

          <SecaoColapsavel
            codigo="02"
            titulo={dados.altitude.titulo}
            legenda={dados.altitude.legenda}
            destaque={dados.altitude.destaque}
          >
            <MapaCalor />
          </SecaoColapsavel>

          <SecaoColapsavel
            codigo="03"
            titulo={dados.tipo.titulo}
            legenda={dados.tipo.legenda}
            destaque={dados.tipo.destaque}
          >
            <GraficoDistribuicao />
          </SecaoColapsavel>

          <SecaoColapsavel
            codigo="04"
            titulo={dados.paises.titulo}
            legenda={dados.paises.legenda}
            destaque={dados.paises.destaque}
          >
            <GraficoPaises />
          </SecaoColapsavel>

          <SecaoColapsavel
            codigo="05"
            titulo={dados.eventos.titulo}
            legenda={dados.eventos.legenda}
          >
            <ol className="space-y-6 border-l border-acento pl-6">
              {EVENTOS_FRAGMENTACAO.map((evento) => (
                <li key={evento.titulo} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[1.65rem] top-1 flex h-3 w-3 items-center justify-center"
                  >
                    <span className="absolute h-3 w-3 animate-ping rounded-full bg-alerta/40" />
                    <span className="relative h-2 w-2 rounded-full bg-alerta shadow-glow-alerta" />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-sm text-primaria">{evento.ano}</span>
                    <h4 className="font-titulo text-lg font-semibold text-texto-destaque">
                      {evento.titulo}
                    </h4>
                    <span className="font-mono text-xs text-alerta">
                      +{formatarNumero(evento.detritosGerados)} detritos
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-texto-secundario">
                    {evento.descricao}
                  </p>
                </li>
              ))}
            </ol>
          </SecaoColapsavel>
        </section>

        {/* Fatos-chave */}
        <section className="dados-entrada">
          <CabecalhoSecao
            codigo="§ FATOS"
            titulo="Quatro telegramas que explicam o problema"
            descricao="Cada um veio de um relatório público diferente."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {dados.fatos.map((fato) => (
              <article
                key={fato.codigo}
                className="group relative overflow-hidden rounded-lg border border-borda bg-fundo-secundario/60 p-6 backdrop-blur-md transition-all hover:border-primaria/60 hover:shadow-glow-primaria"
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-primaria">
                  {fato.codigo}
                </p>
                <h3 className="mt-3 font-titulo text-lg font-semibold leading-snug text-texto-destaque">
                  {fato.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-texto-secundario">
                  {fato.descricao}
                </p>
                <p className="mt-4 border-t border-borda/60 pt-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-texto-secundario">
                  Fonte: {fato.fonte}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Recursos */}
        <section className="dados-entrada">
          <CabecalhoSecao
            codigo="§ FONTES"
            titulo={dados.recursos.titulo}
            descricao={dados.recursos.legenda}
          />
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {dados.recursos.itens.map((recurso) => (
              <li key={recurso.url}>
                <a
                  href={recurso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-lg border border-borda bg-fundo-secundario/50 p-4 transition-all hover:border-primaria hover:bg-fundo-elevado/50 hover:shadow-glow-primaria"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-texto-principal group-hover:text-primaria">
                      {recurso.rotulo}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-texto-secundario">
                      {recurso.contexto}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-lg text-primaria/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primaria"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Rodapé com fonte agregada */}
        <p className="dados-entrada border-t border-borda/60 pt-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-texto-secundario">
          {dados.fonte}
        </p>
      </div>
    </main>
  );
}

interface PropsCabecalho {
  codigo: string;
  titulo: string;
  descricao: string;
}

function CabecalhoSecao({ codigo, titulo, descricao }: PropsCabecalho) {
  return (
    <div className="dados-entrada">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
        {codigo}
      </p>
      <h2 className="mt-3 font-titulo text-2xl font-semibold text-texto-destaque sm:text-3xl">
        {titulo}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-texto-secundario">{descricao}</p>
    </div>
  );
}

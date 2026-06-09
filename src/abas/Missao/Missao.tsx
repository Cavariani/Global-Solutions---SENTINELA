// Aba MISSÃO. Tom propositivo: o que pode ser feito, quem está fazendo e
// por que a entrega faz parte do desafio Space Connect da Global Solutions.
import { useState } from 'react';
import { CardSolucao } from './CardSolucao';
import { CardTecnologia } from './CardTecnologia';
import { LinhaTempo } from './LinhaTempo';
import { TEXTOS } from '@/constantes/textos';

export default function Missao() {
  const { missao, autor } = TEXTOS;
  const [tecnologiaAberta, setTecnologiaAberta] = useState<string | null>(
    missao.tecnologias.itens[0]?.codigo ?? null,
  );

  return (
    <main className="min-h-screen bg-gradiente-fundo px-6 pb-32 pt-28">
      <div className="mx-auto max-w-6xl space-y-24">
        {/* Cabeçalho */}
        <header className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
            {missao.rotulo}
          </p>
          <h1 className="mt-4 font-titulo text-[clamp(2rem,5vw,4rem)] font-bold leading-tight text-texto-destaque">
            {missao.titulo}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-texto-secundario">
            {missao.subtitulo}
          </p>
        </header>

        {/* Contexto Space Connect */}
        <section className="grid gap-10 rounded-xl border border-borda bg-fundo-secundario/50 p-8 backdrop-blur-md md:p-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
              {missao.contexto.rotulo}
            </p>
            <h2 className="mt-3 font-titulo text-[clamp(1.5rem,3vw,2.4rem)] font-semibold leading-tight text-texto-destaque">
              {missao.contexto.titulo}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-texto-secundario">
              {missao.contexto.paragrafos.map((paragrafo) => (
                <p key={paragrafo}>{paragrafo}</p>
              ))}
            </div>
          </div>
          <ul className="flex flex-col gap-4 border-l border-acento/50 pl-6 lg:border-l-2">
            {missao.contexto.marcadores.map((marcador) => (
              <li key={marcador.rotulo}>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-texto-secundario">
                  {marcador.rotulo}
                </p>
                <p className="mt-1 font-titulo text-lg font-semibold text-texto-destaque">
                  {marcador.valor}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Soluções (grade) */}
        <section>
          <h2 className="font-titulo text-2xl font-semibold text-texto-destaque sm:text-3xl">
            Quatro frentes simultâneas
          </h2>
          <p className="mt-3 max-w-2xl text-texto-secundario">
            Limpar a órbita não depende de uma única invenção. Depende de
            tecnologia, regulação, design responsável e vigilância contínua,
            todos em curso ao mesmo tempo.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {missao.solucoes.map((solucao) => (
              <CardSolucao
                key={solucao.titulo}
                icone={solucao.icone}
                titulo={solucao.titulo}
                descricao={solucao.descricao}
                marcador={solucao.marcador}
              />
            ))}
          </div>
        </section>

        {/* Catálogo interativo de tecnologias */}
        <section>
          <h2 className="font-titulo text-2xl font-semibold text-texto-destaque sm:text-3xl">
            {missao.tecnologias.titulo}
          </h2>
          <p className="mt-3 max-w-2xl text-texto-secundario">
            {missao.tecnologias.legenda}
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {missao.tecnologias.itens.map((item) => (
              <CardTecnologia
                key={item.codigo}
                codigo={item.codigo}
                nome={item.nome}
                missao={'missao' in item ? item.missao : undefined}
                principio={item.principio}
                maturidade={item.maturidade}
                desafio={item.desafio}
                aberto={tecnologiaAberta === item.codigo}
                aoAlternar={() =>
                  setTecnologiaAberta(
                    tecnologiaAberta === item.codigo ? null : item.codigo,
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* Linha do tempo */}
        <section>
          <h2 className="font-titulo text-2xl font-semibold text-texto-destaque sm:text-3xl">
            {missao.timeline.titulo}
          </h2>
          <LinhaTempo itens={missao.timeline.itens} />
        </section>

        {/* Chamada */}
        <section className="rounded-lg border border-primaria/30 bg-fundo-secundario/60 p-8 text-center shadow-glow-primaria backdrop-blur-md md:p-12">
          <h2 className="mx-auto max-w-2xl font-titulo text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-texto-destaque">
            {missao.chamada.titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-texto-secundario">
            {missao.chamada.descricao}
          </p>
        </section>

        {/* Recursos categorizados */}
        <section>
          <h2 className="font-titulo text-2xl font-semibold text-texto-destaque sm:text-3xl">
            {missao.recursos.titulo}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {missao.recursos.grupos.map((grupo) => (
              <div key={grupo.rotulo}>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primaria">
                  {grupo.rotulo}
                </h3>
                <ul className="mt-4 space-y-2">
                  {grupo.itens.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-md border border-borda bg-fundo-secundario/50 px-3 py-2.5 font-mono text-[0.75rem] text-texto-principal transition-colors hover:border-primaria hover:text-primaria"
                      >
                        <span className="truncate pr-2">{link.rotulo}</span>
                        <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Sobre o projeto / Autoria */}
        <section className="rounded-xl border border-acento/60 bg-fundo-elevado/40 p-8 backdrop-blur-md md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
                {missao.sobre.rotulo}
              </p>
              <h2 className="mt-3 font-marca text-3xl font-bold uppercase tracking-tight text-texto-destaque sm:text-4xl">
                {missao.sobre.titulo}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-texto-secundario">
                {missao.sobre.descricao}
              </p>
            </div>
            <dl className="space-y-5 font-mono text-xs">
              <div>
                <dt className="uppercase tracking-[0.2em] text-texto-secundario">
                  {missao.sobre.stackRotulo}
                </dt>
                <dd className="mt-1 text-sm text-texto-principal">
                  {missao.sobre.stack}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.2em] text-texto-secundario">
                  {missao.sobre.fonteRotulo}
                </dt>
                <dd className="mt-1 text-sm text-texto-principal">
                  {missao.sobre.fonte}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.2em] text-texto-secundario">
                  {missao.sobre.autorRotulo}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-texto-principal">
                  {autor.nome}
                  <span className="block text-texto-secundario">
                    {autor.rm} · {autor.turma} · {autor.curso}
                  </span>
                  <span className="block text-texto-secundario">
                    {autor.instituicao} · {autor.projeto}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}

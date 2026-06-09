// Página placeholder reutilizável para as abas que serão construídas nas próximas fases.
import { TEXTOS } from '@/constantes/textos';

interface PropsPaginaEmConstrucao {
  titulo: string;
}

export function PaginaEmConstrucao({ titulo }: PropsPaginaEmConstrucao) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradiente-fundo px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primaria">
        {TEXTOS.emConstrucao.titulo}
      </p>
      <h1 className="mt-4 font-titulo text-5xl font-bold text-texto-destaque">
        {titulo}
      </h1>
      <p className="mt-4 max-w-md font-titulo text-texto-secundario">
        {TEXTOS.emConstrucao.descricao}
      </p>
    </main>
  );
}

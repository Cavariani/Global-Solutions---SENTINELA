// Barra de status estilo centro de controle (NORAD-like) · rodapé da aba ÓRBITA.
// Relógio UTC ao vivo, estado do sistema, fonte dos dados e contagem rastreada.
import { useEffect, useState } from 'react';
import { formatarNumero } from '@/utils/formatadores';
import { TEXTOS } from '@/constantes/textos';

interface PropsBarraStatus {
  objetosVisiveis: number;
}

export function BarraStatus({ objetosVisiveis }: PropsBarraStatus) {
  const [horaUtc, setHoraUtc] = useState(() => formatarHoraUtc(new Date()));

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setHoraUtc(formatarHoraUtc(new Date()));
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, []);

  const { barraStatus } = TEXTOS;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 border-t border-primaria/15 bg-fundo-principal/70 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] sm:px-6">
        {/* Esquerda: sistema online + rastreando */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2 text-primaria">
            <span className="h-1.5 w-1.5 rounded-full bg-primaria pulso-status" />
            {barraStatus.sistema}: {barraStatus.online}
          </span>
          <span className="hidden items-center gap-2 text-texto-secundario sm:flex">
            {barraStatus.rastreando}
            <span className="tabular-nums text-texto-principal">
              {formatarNumero(objetosVisiveis)}
            </span>
            {barraStatus.objetos}
          </span>
        </div>

        {/* Centro: fonte, modelo e autoria */}
        <div className="hidden items-center gap-6 text-texto-secundario md:flex">
          <span>
            {barraStatus.fonte}:{' '}
            <span className="text-texto-principal">{barraStatus.fonteValor}</span>
          </span>
          <span>
            {barraStatus.modelo}:{' '}
            <span className="text-texto-principal">{barraStatus.modeloValor}</span>
          </span>
          <span className="hidden lg:inline">
            AUTOR:{' '}
            <span className="text-texto-principal">
              {TEXTOS.autor.nome} · {TEXTOS.autor.rm} · {TEXTOS.autor.turma}
            </span>
          </span>
        </div>

        {/* Direita: relógio UTC ao vivo */}
        <span className="flex items-center gap-2 text-texto-secundario">
          <span className="hidden sm:inline">UTC</span>
          <span className="tabular-nums text-primaria">{horaUtc}</span>
        </span>
      </div>
    </div>
  );
}

// "14:35:07" no fuso UTC.
function formatarHoraUtc(data: Date): string {
  return [data.getUTCHours(), data.getUTCMinutes(), data.getUTCSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

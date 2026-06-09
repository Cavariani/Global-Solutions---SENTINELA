// HUD de estatísticas ao vivo · canto inferior esquerdo da aba ÓRBITA.
import { TEXTOS, DETRITOS_RASTREADOS_TOTAL } from '@/constantes/textos';
import { formatarNumero, formatarHora } from '@/utils/formatadores';
import type { EstatisticasGlobo } from '@/tipos/orbital';

interface PropsPainelHUD {
  estatisticas: EstatisticasGlobo;
  atualizadoEm: Date | null;
  geoDisponivel: boolean;
  aoPedirLocalizacao: () => void;
}

export function PainelHUD({
  estatisticas,
  atualizadoEm,
  geoDisponivel,
  aoPedirLocalizacao,
}: PropsPainelHUD) {
  // Mostra o botão de localização apenas quando o browser suporta geo e o
  // usuário ainda não concedeu (valor "acima de você" ainda nulo).
  const pedirLocalizacao = geoDisponivel && estatisticas.acimaDeVoce === null;

  return (
    <div className="cantoneiras pointer-events-auto absolute bottom-12 left-6 z-20 w-60 rounded-lg border border-borda bg-fundo-secundario/80 px-4 py-3 backdrop-blur-md">
      {/* Cabeçalho */}
      <div className="mb-2 flex items-center gap-2 border-b border-borda/60 pb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primaria pulso-status" />
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-primaria">
          {TEXTOS.hud.titulo}
        </span>
      </div>

      <LinhaHUD
        rotulo={TEXTOS.hud.objetosVisiveis}
        valor={formatarNumero(estatisticas.visiveis)}
        destaque="primaria"
      />
      <LinhaHUD
        rotulo={TEXTOS.hud.detritosRastreados}
        valor={`${formatarNumero(DETRITOS_RASTREADOS_TOTAL)}+`}
        destaque="alerta"
      />
      <LinhaHUD
        rotulo={TEXTOS.hud.acimaDeVoce}
        valor={
          estatisticas.acimaDeVoce !== null
            ? formatarNumero(estatisticas.acimaDeVoce)
            : '–'
        }
        destaque="primaria"
      />
      <LinhaHUD
        rotulo={TEXTOS.hud.ultimaAtualizacao}
        valor={atualizadoEm ? formatarHora(atualizadoEm) : '–'}
      />

      {/* Botão de localização · claramente clicável */}
      {pedirLocalizacao && (
        <button
          onClick={aoPedirLocalizacao}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-primaria/50 bg-primaria/10 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-primaria transition-all hover:border-primaria hover:bg-primaria/20 hover:shadow-glow-primaria"
        >
          <span aria-hidden>📍</span>
          {TEXTOS.hud.permitirLocal}
        </button>
      )}
    </div>
  );
}

interface PropsLinhaHUD {
  rotulo: string;
  valor: React.ReactNode;
  destaque?: 'primaria' | 'alerta';
}

function LinhaHUD({ rotulo, valor, destaque }: PropsLinhaHUD) {
  const corValor =
    destaque === 'primaria'
      ? 'text-primaria'
      : destaque === 'alerta'
        ? 'text-alerta'
        : 'text-texto-principal';
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-texto-secundario">
        {rotulo}
      </span>
      <span className={`font-mono text-sm tabular-nums ${corValor}`}>
        {valor}
      </span>
    </div>
  );
}

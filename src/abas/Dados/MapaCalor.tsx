// "Mapa de calor" da densidade orbital por faixa de altitude.
// Barras de intensidade mostram onde o congestionamento se concentra (LEO domina).
import { DISTRIBUICAO_ALTITUDE } from '@/constantes/estatisticas';
import { formatarNumero } from '@/utils/formatadores';

export function MapaCalor() {
  const maximo = Math.max(...DISTRIBUICAO_ALTITUDE.map((f) => f.objetos));

  return (
    <div className="space-y-5">
      {DISTRIBUICAO_ALTITUDE.map((faixa) => {
        const proporcao = faixa.objetos / maximo;
        const larguraPct = Math.max(proporcao * 100, 6);
        // Mais densa = mais quente (tende ao laranja-alerta); menos densa = azul-gelo.
        const cor = proporcao > 0.6 ? '#ff5722' : proporcao > 0.2 ? '#ff7043' : '#4fc3f7';

        return (
          <div key={faixa.faixa}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="font-titulo text-sm font-semibold text-texto-destaque">
                {faixa.faixa}
                <span className="ml-2 font-mono text-[0.65rem] font-normal text-texto-secundario">
                  {faixa.descricao}
                </span>
              </span>
              <span className="font-mono text-sm tabular-nums text-texto-principal">
                {formatarNumero(faixa.objetos)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-fundo-elevado">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${larguraPct}%`,
                  backgroundColor: cor,
                  boxShadow: `0 0 16px ${cor}66`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Aba ÓRBITA · ponto de entrada do site. Globo 3D em tela cheia com filtros de camada,
// filtro de faixa orbital, HUD ao vivo e painel de detalhes do objeto selecionado.
import { useMemo, useState } from 'react';
import { IntroAnimada } from '@/componentes/IntroAnimada';
import { Globo } from '@/abas/Orbita/Globo';
import { FiltrosOrbita } from '@/abas/Orbita/FiltrosOrbita';
import { PainelHUD } from '@/abas/Orbita/PainelHUD';
import { PainelObjeto } from '@/abas/Orbita/PainelObjeto';
import { PainelConjuncoes } from '@/abas/Orbita/PainelConjuncoes';
import { BarraStatus } from '@/abas/Orbita/BarraStatus';
import { useDadosOrbitais } from '@/hooks/useDadosOrbitais';
import { useGeolocalizacao } from '@/hooks/useGeolocalizacao';
import { GRUPOS_EM_ORDEM } from '@/constantes/camadas';
import type { GrupoCelesTrak } from '@/constantes/grupos';
import { TEXTOS } from '@/constantes/textos';
import { useIntro } from '@/estado/IntroContexto';
import { analisarConjuncoes, type ResultadoAnalise } from '@/utils/conjuncoes';
import type {
  Conjuncao,
  EstatisticasGlobo,
  FaixaOrbital,
  ObjetoOrbital,
} from '@/tipos/orbital';

// Estado inicial das camadas: todas ativas.
const CAMADAS_INICIAIS: Record<string, boolean> = Object.fromEntries(
  GRUPOS_EM_ORDEM.map((grupo) => [grupo, true]),
);

export default function Orbita() {
  const { objetos, carregando, erro, atualizadoEm } =
    useDadosOrbitais(GRUPOS_EM_ORDEM);
  const geo = useGeolocalizacao();

  const [camadasAtivas, setCamadasAtivas] =
    useState<Record<string, boolean>>(CAMADAS_INICIAIS);
  const [faixaOrbital, setFaixaOrbital] = useState<FaixaOrbital>('TODOS');
  const [selecionado, setSelecionado] = useState<ObjetoOrbital | null>(null);
  const { introAtiva, encerrarIntro } = useIntro();
  const [resultadoConjuncoes, setResultadoConjuncoes] =
    useState<ResultadoAnalise | null>(null);
  const [analisandoConjuncoes, setAnalisandoConjuncoes] = useState(false);
  const [conjuncaoDestacada, setConjuncaoDestacada] =
    useState<Conjuncao | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasGlobo>({
    visiveis: 0,
    acimaDeVoce: null,
  });

  // Contagem de objetos por grupo (para o painel de filtros).
  const totalPorGrupo = useMemo(() => {
    const contagem: Record<string, number> = {};
    for (const item of objetos) {
      contagem[item.grupo] = (contagem[item.grupo] ?? 0) + 1;
    }
    return contagem;
  }, [objetos]);

  // Objetos filtrados pelas camadas ativas (filtro de altitude é aplicado no Globo).
  const objetosFiltrados = useMemo(
    () => objetos.filter((item) => camadasAtivas[item.grupo]),
    [objetos, camadasAtivas],
  );

  const alternarCamada = (grupo: GrupoCelesTrak) => {
    setCamadasAtivas((anterior) => ({
      ...anterior,
      [grupo]: !anterior[grupo],
    }));
  };

  const definirTodas = (ativas: boolean) => {
    setCamadasAtivas(
      Object.fromEntries(GRUPOS_EM_ORDEM.map((grupo) => [grupo, ativas])),
    );
  };

  const aoSelecionarObjeto = (objeto: ObjetoOrbital | null) => {
    setSelecionado(objeto);
  };

  // Roda a análise de conjunções sobre os objetos atualmente filtrados.
  // Defere o cálculo pesado (SGP4 em milhares de objetos) para o próximo tick,
  // de modo que o estado "analisando" seja pintado antes de a thread travar.
  const aoAnalisarConjuncoes = () => {
    setAnalisandoConjuncoes(true);
    setConjuncaoDestacada(null);
    window.setTimeout(() => {
      const resultado = analisarConjuncoes(objetosFiltrados, new Date());
      setResultadoConjuncoes(resultado);
      setAnalisandoConjuncoes(false);
    }, 30);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-fundo-principal">
      {/* Globo em tela cheia */}
      {!carregando && !erro && (
        <Globo
          objetos={objetosFiltrados}
          faixaOrbital={faixaOrbital}
          posicaoUsuario={geo.posicao}
          idSelecionado={selecionado?.noradId ?? null}
          conjuncaoDestacada={conjuncaoDestacada}
          aoSelecionarObjeto={aoSelecionarObjeto}
          aoAtualizarEstatisticas={setEstatisticas}
        />
      )}

      {/* Sobreposições de UI */}
      {!carregando && !erro && (
        <>
          <FiltrosOrbita
            camadasAtivas={camadasAtivas}
            totalPorGrupo={totalPorGrupo}
            faixaOrbital={faixaOrbital}
            aoAlternarCamada={alternarCamada}
            aoMudarFaixa={setFaixaOrbital}
            aoDefinirTodas={definirTodas}
          />
          <PainelHUD
            estatisticas={estatisticas}
            atualizadoEm={atualizadoEm}
            geoDisponivel={geo.disponivel}
            aoPedirLocalizacao={geo.solicitar}
          />
          <PainelConjuncoes
            resultado={resultadoConjuncoes}
            analisando={analisandoConjuncoes}
            conjuncaoDestacada={conjuncaoDestacada}
            aoAnalisar={aoAnalisarConjuncoes}
            aoSelecionar={setConjuncaoDestacada}
          />
          <PainelObjeto
            objeto={selecionado}
            aoFechar={() => setSelecionado(null)}
          />
          <BarraStatus objetosVisiveis={estatisticas.visiveis} />
        </>
      )}

      {/* Estado de carregamento */}
      {carregando && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primaria-dim border-t-primaria" />
          <p className="font-mono text-sm text-texto-secundario">
            {TEXTOS.orbita.carregando}
          </p>
        </div>
      )}

      {/* Estado de erro */}
      {erro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-titulo text-xl text-alerta">
            {TEXTOS.orbita.erroCarregamento}
          </p>
          <p className="font-mono text-xs text-texto-secundario">{erro}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md border border-primaria px-4 py-2 font-mono text-sm text-primaria transition-colors hover:bg-primaria-dim/40"
          >
            {TEXTOS.orbita.tentarNovamente}
          </button>
        </div>
      )}

      {introAtiva && !carregando && !erro && (
        <IntroAnimada aoConcluir={encerrarIntro} />
      )}
    </div>
  );
}

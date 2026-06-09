// Globo 3D · o componente central do SENTINELA.
// Renderiza a Terra noturna, atmosfera, estrelas e os objetos orbitais como InstancedMesh
// (um por camada, com cor própria). Posições recalculadas via SGP4 a cada 2s.
// Suporta: filtro de faixa orbital ao vivo, halo de seleção pulsante, cursor no hover
// e emissão de estatísticas (visíveis / acima de você).
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CORES } from '@/constantes/cores';
import { CAMADA_POR_GRUPO } from '@/constantes/camadas';
import type { GrupoCelesTrak } from '@/constantes/grupos';
import {
  RAIO_GLOBO_CENA,
  calcularTrajetoriaOrbital,
  determinarFaixaOrbital,
  distanciaGreatCircleGraus,
  extrairInclinacao,
  extrairMeanMotion,
  latLngParaVetor3D,
  periodoOrbitalMin,
  tleParaLatLng,
} from '@/utils/orbital';
import type {
  Conjuncao,
  EstatisticasGlobo,
  FaixaOrbital,
  ObjetoOrbital,
  TLECategorizado,
} from '@/tipos/orbital';

// Limite de pontos simultâneos (regra de performance inegociável do projeto).
const MAX_PONTOS = 8000;
// Intervalo de recálculo das posições orbitais (ms).
const INTERVALO_PROPAGACAO_MS = 2000;
// Cone (graus) em torno do zênite do usuário que conta como "acima de você".
const LIMITE_ACIMA_GRAUS = 30;

interface PropsGlobo {
  objetos: TLECategorizado[]; // já filtrado pelas camadas ativas
  faixaOrbital: FaixaOrbital;
  posicaoUsuario: { lat: number; lng: number } | null;
  idSelecionado: string | null;
  conjuncaoDestacada: Conjuncao | null;
  aoSelecionarObjeto: (objeto: ObjetoOrbital | null) => void;
  aoAtualizarEstatisticas: (estatisticas: EstatisticasGlobo) => void;
}

export function Globo({
  objetos,
  faixaOrbital,
  posicaoUsuario,
  idSelecionado,
  conjuncaoDestacada,
  aoSelecionarObjeto,
  aoAtualizarEstatisticas,
}: PropsGlobo) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cenaRef = useRef<{
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    cena: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controles: OrbitControls;
    grupoMundo: THREE.Group;
    halo: THREE.Sprite;
    haloConjuncao: THREE.Sprite;
  } | null>(null);

  // Linha da trajetória orbital do objeto selecionado (recriada ao mudar a seleção).
  const linhaOrbitaRef = useRef<THREE.Line | null>(null);

  // Refs sempre atualizados · leem o valor corrente sem recriar a cena.
  const aoSelecionarRef = useRef(aoSelecionarObjeto);
  aoSelecionarRef.current = aoSelecionarObjeto;
  const aoAtualizarStatsRef = useRef(aoAtualizarEstatisticas);
  aoAtualizarStatsRef.current = aoAtualizarEstatisticas;
  const faixaRef = useRef(faixaOrbital);
  faixaRef.current = faixaOrbital;
  const usuarioRef = useRef(posicaoUsuario);
  usuarioRef.current = posicaoUsuario;
  const idSelecionadoRef = useRef(idSelecionado);
  idSelecionadoRef.current = idSelecionado;
  const conjuncaoRef = useRef(conjuncaoDestacada);
  conjuncaoRef.current = conjuncaoDestacada;

  // Função de reposicionamento (recriada a cada mudança de `objetos`), exposta para
  // que mudanças de filtro/seleção disparem atualização imediata.
  const repositorRef = useRef<(() => void) | null>(null);

  // ---- Efeito 1: montar a cena uma única vez ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const largura = container.clientWidth;
    const altura = container.clientHeight;

    const cena = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, largura / altura, 0.1, 2000);
    camera.position.set(0, 4, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(largura, altura);
    renderer.setClearColor(0x050810, 1);
    container.appendChild(renderer.domElement);

    // --- Pós-processamento: bloom cinematográfico nos objetos orbitais ---
    // Só o que é brilhante (acima do threshold) "acende" · o enxame de detritos
    // ganha um glow real e os aglomerados densos viram pontos quentes.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(cena, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(largura, altura),
      0.7, // intensidade
      0.5, // raio
      0.2, // limiar (mantém a Terra sem estourar)
    );
    composer.addPass(bloom);

    const controles = new OrbitControls(camera, renderer.domElement);
    controles.enableDamping = true;
    controles.dampingFactor = 0.05;
    controles.rotateSpeed = 0.4;
    controles.minDistance = 7;
    controles.maxDistance = 30;
    controles.enablePan = false;

    cena.add(new THREE.AmbientLight(0x333344, 0.5));
    const sol = new THREE.DirectionalLight(0xffffff, 1.2);
    sol.position.set(5, 3, 5);
    cena.add(sol);

    const grupoMundo = new THREE.Group();
    cena.add(grupoMundo);

    // --- Terra ---
    const carregador = new THREE.TextureLoader();
    const geoTerra = new THREE.SphereGeometry(RAIO_GLOBO_CENA, 64, 64);
    const materialTerra = new THREE.MeshPhongMaterial({
      color: 0x223344,
      emissive: 0xffffff,
      emissiveIntensity: 1.1,
      shininess: 8,
    });
    carregador.load('/texturas/terra-noturna.png', (textura) => {
      textura.colorSpace = THREE.SRGBColorSpace;
      materialTerra.map = textura;
      materialTerra.emissiveMap = textura;
      materialTerra.color = new THREE.Color(0x556677);
      materialTerra.needsUpdate = true;
    });
    carregador.load('/texturas/terra-especular.jpg', (textura) => {
      materialTerra.specularMap = textura;
      materialTerra.specular = new THREE.Color(0x223344);
      materialTerra.needsUpdate = true;
    });
    const terra = new THREE.Mesh(geoTerra, materialTerra);
    grupoMundo.add(terra);

    // --- Atmosfera (rim glow via shader fresnel) ---
    const geoAtmosfera = new THREE.SphereGeometry(RAIO_GLOBO_CENA * 1.04, 64, 64);
    const materialAtmosfera = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: { corAtmosfera: { value: new THREE.Color(CORES.primaria) } },
      vertexShader: `
        varying vec3 normalVar;
        void main() {
          normalVar = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 normalVar;
        uniform vec3 corAtmosfera;
        void main() {
          float intensidade = pow(0.7 - dot(normalVar, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(corAtmosfera, 1.0) * intensidade;
        }
      `,
    });
    grupoMundo.add(new THREE.Mesh(geoAtmosfera, materialAtmosfera));

    // --- Halo atmosférico externo (bloom aditivo suave) ---
    const geoHalo = new THREE.SphereGeometry(RAIO_GLOBO_CENA * 1.18, 64, 64);
    const materialHaloAtmosfera = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: { corAtmosfera: { value: new THREE.Color(CORES.primaria) } },
      vertexShader: `
        varying vec3 normalVar;
        void main() {
          normalVar = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 normalVar;
        uniform vec3 corAtmosfera;
        void main() {
          float intensidade = pow(0.62 - dot(normalVar, vec3(0.0, 0.0, 1.0)), 3.5) * 0.55;
          gl_FragColor = vec4(corAtmosfera, 1.0) * intensidade;
        }
      `,
    });
    grupoMundo.add(new THREE.Mesh(geoHalo, materialHaloAtmosfera));

    // --- Estrelas de fundo (duas camadas para dar profundidade) ---
    const recursosEstrelas: {
      pontos: THREE.Points;
      geometria: THREE.BufferGeometry;
      material: THREE.PointsMaterial;
    }[] = [];

    const criarCamadaEstrelas = (
      total: number,
      tamanho: number,
      cor: number,
      opacidade: number,
    ): THREE.Points => {
      const geometria = new THREE.BufferGeometry();
      const posicoes = new Float32Array(total * 3);
      for (let i = 0; i < total; i++) {
        const raio = 120 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        posicoes[i * 3] = raio * Math.sin(phi) * Math.cos(theta);
        posicoes[i * 3 + 1] = raio * Math.sin(phi) * Math.sin(theta);
        posicoes[i * 3 + 2] = raio * Math.cos(phi);
      }
      geometria.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
      const material = new THREE.PointsMaterial({
        color: cor,
        size: tamanho,
        sizeAttenuation: true,
        transparent: true,
        opacity: opacidade,
      });
      const pontos = new THREE.Points(geometria, material);
      cena.add(pontos);
      recursosEstrelas.push({ pontos, geometria, material });
      return pontos;
    };

    const estrelasFinas = criarCamadaEstrelas(5200, 0.55, 0xffffff, 0.8);
    const estrelasBrilhantes = criarCamadaEstrelas(700, 1.5, 0xbfe6ff, 1);

    // --- Halo de seleção (sprite com gradiente radial) ---
    const texturaHalo = criarTexturaHalo();
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texturaHalo,
        color: new THREE.Color(CORES.primaria),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    halo.scale.setScalar(0.6);
    halo.visible = false;
    grupoMundo.add(halo);

    // --- Halo de conjunção (marcador vermelho no ponto de aproximação) ---
    const haloConjuncao = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texturaHalo,
        color: new THREE.Color(CORES.alerta),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    haloConjuncao.scale.setScalar(0.5);
    haloConjuncao.visible = false;
    grupoMundo.add(haloConjuncao);

    // --- Loop de animação ---
    let animacaoId = 0;
    const relogio = new THREE.Clock();
    const animar = () => {
      animacaoId = requestAnimationFrame(animar);
      const t = relogio.getElapsedTime();
      grupoMundo.rotation.y += 0.0004;
      // Deriva lenta das estrelas (parallax sutil).
      estrelasFinas.rotation.y += 0.00004;
      estrelasBrilhantes.rotation.y += 0.00007;
      // Pulso do halo de seleção.
      if (halo.visible) {
        halo.scale.setScalar(0.5 + 0.12 * Math.sin(t * 4));
      }
      // Pulso (mais intenso) do halo de conjunção · chama atenção para o risco.
      if (haloConjuncao.visible) {
        haloConjuncao.scale.setScalar(0.45 + 0.22 * Math.sin(t * 6));
      }
      controles.update();
      composer.render();
    };
    animar();

    const aoRedimensionar = () => {
      const l = container.clientWidth;
      const a = container.clientHeight;
      camera.aspect = l / a;
      camera.updateProjectionMatrix();
      renderer.setSize(l, a);
      composer.setSize(l, a);
    };
    window.addEventListener('resize', aoRedimensionar);

    cenaRef.current = {
      renderer,
      composer,
      cena,
      camera,
      controles,
      grupoMundo,
      halo,
      haloConjuncao,
    };

    return () => {
      cancelAnimationFrame(animacaoId);
      window.removeEventListener('resize', aoRedimensionar);
      controles.dispose();
      geoTerra.dispose();
      materialTerra.dispose();
      geoAtmosfera.dispose();
      materialAtmosfera.dispose();
      geoHalo.dispose();
      materialHaloAtmosfera.dispose();
      recursosEstrelas.forEach((r) => {
        r.geometria.dispose();
        r.material.dispose();
      });
      texturaHalo.dispose();
      (halo.material as THREE.SpriteMaterial).dispose();
      (haloConjuncao.material as THREE.SpriteMaterial).dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      cenaRef.current = null;
    };
  }, []);

  // ---- Efeito 2: (re)construir os objetos quando a lista de camadas muda ----
  useEffect(() => {
    const refs = cenaRef.current;
    if (!refs) return;
    const { grupoMundo, halo, haloConjuncao } = refs;

    const visiveis = selecionarComLimite(objetos, MAX_PONTOS);

    // Agrupa por grupo (cada grupo = um InstancedMesh com cor própria).
    const porGrupo = new Map<GrupoCelesTrak, TLECategorizado[]>();
    visiveis.forEach((item) => {
      const g = item.grupo as GrupoCelesTrak;
      const lista = porGrupo.get(g);
      if (lista) lista.push(item);
      else porGrupo.set(g, [item]);
    });

    const dummy = new THREE.Object3D();
    const meshes: THREE.InstancedMesh[] = [];
    const itensPorMesh = new Map<THREE.InstancedMesh, TLECategorizado[]>();

    porGrupo.forEach((lista, grupo) => {
      const camada = CAMADA_POR_GRUPO[grupo];
      const geometria = new THREE.SphereGeometry(camada.tamanho, 6, 6);
      // Blending aditivo: pontos próximos somam brilho · o enxame "acende"
      // e aglomerados densos viram pontos quentes (leitura de congestionamento).
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(camada.cor),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.InstancedMesh(geometria, material, lista.length);
      mesh.frustumCulled = false;
      mesh.name = `camada-${grupo}`;
      grupoMundo.add(mesh);
      meshes.push(mesh);
      itensPorMesh.set(mesh, lista);
    });

    // Recalcula e aplica as posições, aplicando o filtro de altitude e contabilizando
    // estatísticas + posição do objeto selecionado.
    const atualizarPosicoes = () => {
      const agora = new Date();
      const faixa = faixaRef.current;
      const usuario = usuarioRef.current;
      const idSel = idSelecionadoRef.current;

      let visiveisCount = 0;
      let acimaCount = 0;
      let achouSelecionado = false;

      meshes.forEach((mesh) => {
        const itens = itensPorMesh.get(mesh);
        if (!itens) return;
        itens.forEach((item, i) => {
          const geo = tleParaLatLng(item.tle, agora);

          const dentroDaFaixa =
            geo !== null &&
            (faixa === 'TODOS' || determinarFaixaOrbital(geo.alt) === faixa);

          if (!geo || !dentroDaFaixa) {
            // Esconde: escala 0 em posição neutra (não recebe raycast).
            dummy.position.set(0, 0, 0);
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            return;
          }

          const posicao = latLngParaVetor3D(geo.lat, geo.lng, geo.alt);
          dummy.position.copy(posicao);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          visiveisCount++;

          if (
            usuario &&
            distanciaGreatCircleGraus(
              usuario.lat,
              usuario.lng,
              geo.lat,
              geo.lng,
            ) <= LIMITE_ACIMA_GRAUS
          ) {
            acimaCount++;
          }

          if (idSel && item.tle.noradId === idSel) {
            halo.position.copy(posicao);
            achouSelecionado = true;
          }
        });
        mesh.instanceMatrix.needsUpdate = true;
      });

      halo.visible = achouSelecionado;

      // Halo de conjunção · posiciona no ponto médio do par destacado, propagando
      // os dois TLEs diretamente (independe da amostragem do enxame).
      const conj = conjuncaoRef.current;
      if (conj) {
        const ga = tleParaLatLng(conj.a.tle, agora);
        const gb = tleParaLatLng(conj.b.tle, agora);
        if (ga && gb) {
          const pa = latLngParaVetor3D(ga.lat, ga.lng, ga.alt);
          const pb = latLngParaVetor3D(gb.lat, gb.lng, gb.alt);
          haloConjuncao.position.copy(pa.add(pb).multiplyScalar(0.5));
          haloConjuncao.visible = true;
        } else {
          haloConjuncao.visible = false;
        }
      } else {
        haloConjuncao.visible = false;
      }

      aoAtualizarStatsRef.current({
        visiveis: visiveisCount,
        acimaDeVoce: usuario ? acimaCount : null,
      });
    };

    repositorRef.current = atualizarPosicoes;
    atualizarPosicoes();
    const intervalo = window.setInterval(
      atualizarPosicoes,
      INTERVALO_PROPAGACAO_MS,
    );

    // --- Interação: clique seleciona; hover muda o cursor ---
    const raycaster = new THREE.Raycaster();
    const ponteiro = new THREE.Vector2();

    const calcularPonteiro = (evento: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return null;
      const limites = container.getBoundingClientRect();
      ponteiro.x = ((evento.clientX - limites.left) / limites.width) * 2 - 1;
      ponteiro.y = -((evento.clientY - limites.top) / limites.height) * 2 + 1;
      return ponteiro;
    };

    const aoClicar = (evento: MouseEvent) => {
      const refsAtual = cenaRef.current;
      if (!refsAtual || !calcularPonteiro(evento)) return;
      raycaster.setFromCamera(ponteiro, refsAtual.camera);
      const intersecoes = raycaster.intersectObjects(meshes, false);
      if (intersecoes.length === 0) {
        aoSelecionarRef.current(null);
        return;
      }
      const acerto = intersecoes[0];
      const mesh = acerto.object as THREE.InstancedMesh;
      const itens = itensPorMesh.get(mesh);
      if (!itens || acerto.instanceId === undefined) return;
      const objeto = construirObjetoOrbital(itens[acerto.instanceId]);
      aoSelecionarRef.current(objeto);
    };

    let ultimoHover = 0;
    const dom = refs.renderer.domElement;
    const aoMover = (evento: MouseEvent) => {
      const agora = performance.now();
      if (agora - ultimoHover < 70) return; // throttle
      ultimoHover = agora;
      const refsAtual = cenaRef.current;
      if (!refsAtual || !calcularPonteiro(evento)) return;
      raycaster.setFromCamera(ponteiro, refsAtual.camera);
      const tem = raycaster.intersectObjects(meshes, false).length > 0;
      dom.style.cursor = tem ? 'pointer' : 'grab';
    };

    dom.addEventListener('click', aoClicar);
    dom.addEventListener('mousemove', aoMover);
    dom.style.cursor = 'grab';

    return () => {
      clearInterval(intervalo);
      dom.removeEventListener('click', aoClicar);
      dom.removeEventListener('mousemove', aoMover);
      repositorRef.current = null;
      meshes.forEach((mesh) => {
        grupoMundo.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        mesh.dispose();
      });
    };
  }, [objetos]);

  // ---- Efeito 3: filtro de faixa ou seleção mudou → reposiciona imediatamente ----
  useEffect(() => {
    repositorRef.current?.();
  }, [faixaOrbital, idSelecionado, posicaoUsuario, conjuncaoDestacada]);

  // ---- Efeito 4: trajetória orbital do objeto selecionado ----
  // Desenha a volta orbital completa (uma linha) na cor da camada do objeto.
  useEffect(() => {
    const refs = cenaRef.current;
    if (!refs) return;
    const { grupoMundo } = refs;

    const removerLinha = () => {
      const anterior = linhaOrbitaRef.current;
      if (anterior) {
        grupoMundo.remove(anterior);
        anterior.geometry.dispose();
        (anterior.material as THREE.Material).dispose();
        linhaOrbitaRef.current = null;
      }
    };
    removerLinha();

    if (!idSelecionado) return;
    const item = objetos.find((o) => o.tle.noradId === idSelecionado);
    if (!item) return;

    const pontos = calcularTrajetoriaOrbital(item.tle, new Date());
    if (!pontos) return;

    const camada = CAMADA_POR_GRUPO[item.grupo as GrupoCelesTrak];
    const geometria = new THREE.BufferGeometry().setFromPoints(pontos);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(camada?.cor ?? CORES.primaria),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linha = new THREE.Line(geometria, material);
    linha.frustumCulled = false;
    grupoMundo.add(linha);
    linhaOrbitaRef.current = linha;

    return removerLinha;
  }, [idSelecionado, objetos]);

  return (
    <div ref={containerRef} className="h-full w-full" style={{ touchAction: 'none' }} />
  );
}

// Seleciona até `max` objetos garantindo representação de TODAS as camadas.
// Camadas pequenas (estações, detritos) entram inteiras; constelações enormes
// (Starlink, ativos) são amostradas por passo · assim a nuvem de detritos nunca
// é "engolida" pelos milhares de satélites ativos no limite de 8.000 pontos.
function selecionarComLimite(
  objetos: TLECategorizado[],
  max: number,
): TLECategorizado[] {
  if (objetos.length <= max) return objetos;

  const porGrupo = new Map<string, TLECategorizado[]>();
  for (const o of objetos) {
    const lista = porGrupo.get(o.grupo);
    if (lista) lista.push(o);
    else porGrupo.set(o.grupo, [o]);
  }

  // Processa do menor para o maior grupo: os pequenos consomem pouca cota e
  // liberam orçamento para os grandes.
  const entradas = [...porGrupo.values()].sort((a, b) => a.length - b.length);
  let restante = max;
  let gruposRestantes = entradas.length;
  const resultado: TLECategorizado[] = [];

  for (const lista of entradas) {
    const cota = Math.floor(restante / gruposRestantes);
    const pegar = Math.min(lista.length, cota);
    if (pegar >= lista.length) {
      resultado.push(...lista);
    } else {
      const passo = lista.length / pegar;
      for (let i = 0; i < pegar; i++) {
        resultado.push(lista[Math.floor(i * passo)]);
      }
    }
    restante -= pegar;
    gruposRestantes--;
  }

  return resultado;
}

// Gera uma textura de halo (gradiente radial) para o sprite de seleção.
function criarTexturaHalo(): THREE.CanvasTexture {
  const tamanho = 128;
  const canvas = document.createElement('canvas');
  canvas.width = tamanho;
  canvas.height = tamanho;
  const ctx = canvas.getContext('2d')!;
  const gradiente = ctx.createRadialGradient(
    tamanho / 2,
    tamanho / 2,
    tamanho * 0.18,
    tamanho / 2,
    tamanho / 2,
    tamanho / 2,
  );
  gradiente.addColorStop(0, 'rgba(255,255,255,0)');
  gradiente.addColorStop(0.55, 'rgba(255,255,255,0.85)');
  gradiente.addColorStop(0.7, 'rgba(255,255,255,0.25)');
  gradiente.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, tamanho, tamanho);
  return new THREE.CanvasTexture(canvas);
}

// Constrói o objeto orbital completo (com dados propagados) a partir do TLE.
function construirObjetoOrbital(item: TLECategorizado): ObjetoOrbital | null {
  const agora = new Date();
  const geo = tleParaLatLng(item.tle, agora);
  if (!geo) return null;

  const meanMotion = extrairMeanMotion(item.tle.linha2);

  return {
    noradId: item.tle.noradId,
    nome: item.tle.nome,
    categoria: item.categoria,
    grupo: item.grupo,
    posicao: { x: 0, y: 0, z: 0 },
    latitude: geo.lat,
    longitude: geo.lng,
    altitudeKm: geo.alt,
    velocidadeKmS: geo.velocidadeKmS,
    faixaOrbital: determinarFaixaOrbital(geo.alt),
    inclinacaoGraus: extrairInclinacao(item.tle.linha2),
    periodoMin: periodoOrbitalMin(meanMotion),
    tle: item.tle,
  };
}

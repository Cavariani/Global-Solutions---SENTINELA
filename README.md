# SENTINELA

> Plataforma web de monitoramento e conscientização sobre detritos orbitais.
> *"Tudo que lançamos ainda está lá cima."*

Entrega da **Global Solutions 2026/1 · Space Connect** da FIAP.

**Vídeo de apresentação:** https://www.youtube.com/watch?v=sk_RaUaNSH4

---

## O problema

Desde 1957, a humanidade colocou em órbita mais de 36 mil objetos rastreáveis e
deixou cerca de 140 milhões de fragmentos pequenos demais para serem catalogados.
Tudo isso viaja a 27.000 km/h. A 7,5 vezes a velocidade de uma bala de rifle, uma
lasca de tinta perfura um painel solar.

A consequência tem nome: **Síndrome de Kessler**. A partir de certa densidade,
cada colisão produz mil fragmentos que causam novas colisões, e a órbita inteira
fica inutilizável por gerações. GPS, internet, previsão do tempo, transações
financeiras e controle aéreo dependem do que está lá em cima.

O problema é **tecnicamente urgente, mas politicamente invisível**. A maioria das
pessoas, incluindo formuladores de política pública, nunca enxergou de fato o
quão congestionada está a órbita da Terra. E não se exige proteção para o que
não se enxerga.

## A solução

O SENTINELA conecta o público ao que está acontecendo na órbita em tempo real.
Em vez de relatórios técnicos, mostra o problema de forma visual, dramática e
auditável.

Quatro abas, todas com dados públicos:

- **ÓRBITA** · Globo 3D interativo com até 8.000 objetos posicionados em tempo
  real a partir de TLEs do CelesTrak. Filtros por camada (estações, satélites
  ativos, Starlink, detritos), seleção de objeto, análise de risco de colisão
  via propagação SGP4.
- **CRISE** · Storytelling com scroll que apresenta os números, a velocidade,
  o Efeito Kessler, o que perderíamos e a linha do tempo dos eventos reais de
  fragmentação.
- **MISSÃO** · Catálogo de soluções em curso: tecnologias de remoção ativa,
  regulamentação internacional, missões reais (ClearSpace-1, ADRAS-J,
  RemoveDEBRIS) e recursos para aprofundamento.
- **DADOS** · Dossiê analítico com KPIs, gráficos colapsáveis, fatos-chave e
  links para todas as fontes públicas usadas.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| Globo 3D | Three.js (InstancedMesh para 60 fps) |
| Propagação orbital | satellite.js (modelo SGP4) |
| Animações | GSAP + ScrollTrigger |
| Gráficos | Recharts |
| Roteamento | React Router 6 |
| Backend | Vercel Edge Functions (proxy + cache) |

## Fontes de dados (todas públicas)

- **CelesTrak GP Data** · TLEs em tempo real (`https://celestrak.org`)
- **ESA Space Environment Report 2025** · estatísticas históricas
- **NASA Orbital Debris Program Office** · contexto científico
- **Space-Track.org** · catálogo NORAD (autenticação opcional)
- **LeoLabs** · referência de monitoramento comercial

## Como executar

Pré-requisitos: **Node.js 20+** e **npm 10+**.

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# 3. Build de produção
npm run build

# 4. Pré-visualizar o build
npm run preview
```

### Variáveis de ambiente (opcional)

Apenas se quiser habilitar o proxy de Space-Track. Copie `.env.example` para
`.env.local` e preencha as credenciais do cadastro gratuito em
[space-track.org](https://www.space-track.org).

```env
SPACETRACK_USER=
SPACETRACK_PASS=
```

O projeto funciona inteiramente sem Space-Track. O CelesTrak já entrega todos os
TLEs usados pelo globo.

## Estrutura

```
src/
├── abas/             # Páginas: Orbita, Crise, Dados, Missao
├── componentes/      # Navegação, intro, filtros reutilizáveis
├── constantes/       # Cores, grupos, camadas, textos, estatísticas
├── estado/           # Contextos React (intro cinematográfica)
├── hooks/            # useDadosOrbitais, useGeolocalizacao
├── servicos/         # Cliente CelesTrak, cache TTL
├── tipos/            # Tipos TypeScript do domínio orbital
└── utils/            # Mecânica orbital (TLE → posição 3D), formatação

api/                  # Vercel Edge Functions (proxy CelesTrak + Space-Track)
```

## Performance

- TLEs com cache de 4 horas (Edge Function + memória + disco no dev).
- Máximo 8.000 pontos no globo via `InstancedMesh`.
- Bundle splitting: Three.js em chunk separado.
- Lazy loading das abas que não são a entrada.

## Autoria

**Pedro Ruvieri Cavariani** · RM 551380 · 4SIOA
Sistemas de Informação · FIAP
Global Solutions 2026/1 · Space Connect

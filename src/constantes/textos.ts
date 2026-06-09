// Strings visíveis do site centralizadas (i18n-ready).
// Não hardcodar texto visível fora deste arquivo (convenção do projeto).

export const TEXTOS = {
  marca: {
    nome: 'SENTINELA',
    tagline: 'Tudo que lançamos ainda está lá cima.',
  },

  navegacao: {
    orbita: 'ÓRBITA',
    crise: 'CRISE',
    dados: 'DADOS',
    missao: 'MISSÃO',
  },

  orbita: {
    carregando: 'Carregando dados orbitais...',
    erroCarregamento: 'Não foi possível carregar os dados orbitais.',
    tentarNovamente: 'Tentar novamente',
    avisoMobile:
      'A visualização 3D funciona melhor em desktop. Em telas pequenas o desempenho pode cair.',
  },

  intro: {
    eyebrow: 'SISTEMA DE MONITORAMENTO ORBITAL',
    versao: 'v1.0 · DADOS AO VIVO',
    linhas: ['Tudo que lançamos', 'ainda está lá cima.'],
    prosa:
      'Desde 1957, mais de 36 mil objetos rastreáveis se acumularam ao redor da Terra. A maioria não responde, não desvia e não para. O SENTINELA rastreia esse enxame em tempo real, para você ver o que cruza o céu sobre a sua cabeça agora.',
    estatisticas: [
      { valor: 36500, sufixo: '+', rotulo: 'OBJETOS RASTREADOS' },
      { valor: 140000000, sufixo: '', rotulo: 'FRAGMENTOS > 1MM' },
      { valor: 27000, sufixo: ' KM/H', rotulo: 'VELOCIDADE DE IMPACTO' },
    ],
    cta: 'Iniciar monitoramento',
    chamada: 'SENTINELA ONLINE',
    pular: 'Pular',
  },

  hud: {
    titulo: 'TELEMETRIA',
    objetosVisiveis: 'OBJETOS VISÍVEIS',
    detritosRastreados: 'DETRITOS RASTREADOS',
    acimaDeVoce: 'ACIMA DE VOCÊ AGORA',
    ultimaAtualizacao: 'ÚLTIMA ATUALIZAÇÃO',
    permitirLocal: 'Permitir localização',
  },

  conjuncoes: {
    titulo: 'Análise de risco',
    subtitulo: 'Conjunções nas posições atuais (SGP4)',
    analisar: 'Analisar risco de colisão',
    analisando: 'Propagando órbitas...',
    reanalisar: 'Reanalisar',
    limiar: 'Aproximações abaixo de 10 km',
    nenhuma: 'Nenhuma aproximação crítica nas posições atuais. A órbita está sempre mudando, reanalise em instantes.',
    totalAnalisado: 'OBJETOS ANALISADOS',
    criticas: 'CRÍTICAS (< 2 KM)',
    encontradas: 'CONJUNÇÕES',
    colunaDistancia: 'SEPARAÇÃO',
    colunaVelocidade: 'V. RELATIVA',
    fechar: 'Limpar destaque',
    explicacao:
      'Cada item é um par de objetos cujas trajetórias passam a menos de 10 km um do outro neste instante. Clique para destacar no globo. É o mesmo tipo de alerta que operadores usam para decidir manobras de desvio.',
    niveis: {
      critico: 'CRÍTICO',
      alto: 'ALTO',
      moderado: 'MODERADO',
    },
  },

  objeto: {
    trajetoria: 'Trajetória orbital',
    trajetoriaAtiva: 'Órbita destacada no globo',
  },

  barraStatus: {
    sistema: 'SISTEMA',
    online: 'ONLINE',
    rastreando: 'RASTREANDO',
    fonte: 'FONTE',
    fonteValor: 'CelesTrak · NORAD',
    modelo: 'MODELO',
    modeloValor: 'SGP4',
    objetos: 'OBJETOS',
  },

  crise: {
    rotulo: 'A CRISE',
    subtitulo: 'Role para entender por que a órbita virou um campo minado.',
    progresso: 'CAPÍTULO',
    cap1: {
      rotulo: '01 / OS NÚMEROS',
      titulo: 'fragmentos em órbita',
      legenda:
        'Estimativa de objetos com mais de 1 mm cruzando a órbita terrestre. A maioria é pequena demais para rastrear, e rápida demais para sobreviver a um impacto.',
    },
    cap2: {
      rotulo: '02 / A VELOCIDADE',
      titulo: 'A 27.000 km/h, tamanho não importa.',
      legenda:
        'Um fragmento de 1 cm libera a energia de uma granada de mão. Nessa velocidade, uma lasca de tinta já perfura um painel solar.',
      comparativos: [
        { rotulo: 'Bala de rifle', valor: 'A 3.600 km/h' },
        { rotulo: 'Detrito orbital', valor: 'A 27.000 km/h' },
        { rotulo: '7,5× mais rápido', valor: 'que um projétil' },
      ],
    },
    cap3: {
      rotulo: '03 / O EFEITO KESSLER',
      titulo: 'Uma colisão gera mil. Mil geram um milhão.',
      legenda:
        'Síndrome de Kessler: a partir de certa densidade, cada impacto produz detritos que causam novos impactos, uma reação em cadeia que pode tornar a órbita inutilizável por gerações.',
      etapas: [
        'Dois objetos colidem',
        'Centenas de fragmentos se espalham',
        'Cada fragmento ameaça outros satélites',
        'A cascata se torna autossustentável',
      ],
    },
    cap4: {
      rotulo: '04 / O QUE VOCÊ PERDERIA',
      titulo: 'A vida moderna depende do que está lá em cima.',
      legenda:
        'Se a órbita baixa colapsar, estes serviços param. Não amanhã: em minutos.',
      itens: [
        { icone: '📍', nome: 'GPS', detalhe: 'Navegação, mapas, entregas' },
        { icone: '🌐', nome: 'Internet', detalhe: 'Conexão em regiões remotas' },
        { icone: '🌦️', nome: 'Previsão do tempo', detalhe: 'Alertas de desastres' },
        { icone: '📡', nome: 'Comunicações', detalhe: 'TV, telefonia, rádio' },
        { icone: '🏦', nome: 'Sistema financeiro', detalhe: 'Transações sincronizadas por satélite' },
        { icone: '✈️', nome: 'Aviação', detalhe: 'Rotas e controle de tráfego aéreo' },
      ],
    },
    cap5: {
      rotulo: '05 / A LINHA DO TEMPO',
      titulo: 'Não é ficção. Já está acontecendo.',
      legenda:
        'Os eventos reais que mais poluíram a órbita, e que tornam o Efeito Kessler uma ameaça concreta.',
    },
  },

  dados: {
    rotulo: 'TELEMETRIA · ARQUIVO PÚBLICO',
    titulo: 'O retrato do congestionamento.',
    subtitulo:
      'Dados públicos da ESA, NASA e CelesTrak. Tudo que medimos confirma a mesma tendência: a órbita está cada vez mais cheia.',
    chamadaAoVivo: 'TRANSMISSÃO AO VIVO',
    fonte: 'Fontes: ESA Space Environment Report 2025 · NASA ODPO · CelesTrak SATCAT',

    // Indicadores principais (KPIs) destacados no topo da aba.
    indicadores: [
      {
        rotulo: 'OBJETOS CATALOGADOS',
        valor: '36.500+',
        contexto: 'NORAD / Space-Track, junho 2026',
        tom: 'primaria',
      },
      {
        rotulo: 'FRAGMENTOS > 1 MM',
        valor: '140 mi',
        contexto: 'Estimativa ESA · não rastreáveis',
        tom: 'alerta',
      },
      {
        rotulo: 'VELOCIDADE MÉDIA EM LEO',
        valor: '27.000 km/h',
        contexto: '7,5× mais rápido que uma bala de rifle',
        tom: 'alerta',
      },
      {
        rotulo: 'COLISÕES POR DIA',
        valor: '~1.000',
        contexto: 'Alertas de aproximação (LeoLabs)',
        tom: 'primaria',
      },
    ],

    crescimento: {
      titulo: 'Crescimento histórico (1957·2026)',
      legenda: 'Objetos catalogados em órbita desde o Sputnik.',
      destaque: {
        rotulo: 'CRESCIMENTO 2000·2026',
        valor: '+305%',
        descricao:
          'A era das megaconstelações multiplicou o catálogo. A maioria dos satélites ativos lá em cima hoje foi lançada nos últimos cinco anos.',
      },
    },
    altitude: {
      titulo: 'Distribuição por altitude',
      legenda: 'A órbita baixa (LEO) concentra a maior parte do tráfego e do risco.',
      destaque: {
        rotulo: 'CONCENTRAÇÃO EM LEO',
        valor: '79%',
        descricao:
          'A faixa entre 160 e 2.000 km abriga 4 em cada 5 objetos rastreados. É também onde acontecem as colisões mais perigosas.',
      },
    },
    tipo: {
      titulo: 'Distribuição por tipo',
      legenda: 'A maioria dos objetos rastreados já é lixo, não satélites úteis.',
      destaque: {
        rotulo: 'DETRITOS NO CATÁLOGO',
        valor: '60%',
        descricao:
          'Mais da metade do que está lá em cima não tem mais função. São apenas detritos e corpos de foguete abandonados.',
      },
    },
    paises: {
      titulo: 'Top 10 países por objetos em órbita',
      legenda: 'Poucos países respondem pela maior parte do que está lá em cima.',
      destaque: {
        rotulo: 'TRÊS PRIMEIROS',
        valor: '87%',
        descricao:
          'Estados Unidos, Rússia e China somados representam quase nove em cada dez objetos rastreáveis em órbita.',
      },
    },
    eventos: {
      titulo: 'Eventos de fragmentação',
      legenda: 'Os momentos que mais geraram detritos, e quantos cada um criou.',
    },

    // Fatos-chave destacados (cards de "telegrama").
    fatos: [
      {
        codigo: 'FATO-01',
        titulo: 'Um pedaço de tinta perfura uma janela.',
        descricao:
          'A ISS já trocou janelas atingidas por fragmentos de menos de 1 mm. A energia cinética em LEO é o que importa, não o tamanho.',
        fonte: 'NASA · Orbital Debris Quarterly News',
      },
      {
        codigo: 'FATO-02',
        titulo: '1.000 alertas de colisão por dia.',
        descricao:
          'Operadores recebem mais de mil avisos diários de aproximações de risco. SpaceX manobra Starlinks dezenas de vezes por mês.',
        fonte: 'LeoLabs · Conjunction Reports',
      },
      {
        codigo: 'FATO-03',
        titulo: 'Ponto Nemo é o cemitério orbital.',
        descricao:
          'Latitude 48°52′ S, longitude 123°23′ W. O ponto do Pacífico mais distante de qualquer terra é onde reentradas controladas pousam, longe de pessoas.',
        fonte: 'NASA · Spacecraft Disposal',
      },
      {
        codigo: 'FATO-04',
        titulo: 'A regra dos 25 anos virou 5.',
        descricao:
          'A FCC americana reduziu o prazo de desorbitação obrigatória de 25 para 5 anos depois do fim da vida útil de qualquer satélite licenciado.',
        fonte: 'FCC · Order 22-74 (2022)',
      },
    ],

    recursos: {
      titulo: 'Cruze os dados na fonte',
      legenda: 'Tudo aqui foi extraído de bases públicas. Você pode auditar.',
      itens: [
        {
          rotulo: 'ESA Space Environment Report 2025',
          contexto: 'Relatório anual com séries históricas completas',
          url: 'https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025',
        },
        {
          rotulo: 'NASA Orbital Debris Program',
          contexto: 'Modelos, estatísticas e ODQN trimestral',
          url: 'https://orbitaldebris.jsc.nasa.gov/',
        },
        {
          rotulo: 'CelesTrak GP Data',
          contexto: 'Elementos orbitais (TLE) em tempo real',
          url: 'https://celestrak.org/NORAD/elements/',
        },
        {
          rotulo: 'Space-Track.org',
          contexto: 'Catálogo NORAD oficial · cadastro gratuito',
          url: 'https://www.space-track.org',
        },
        {
          rotulo: 'LeoLabs Dashboard',
          contexto: 'Monitoramento comercial em LEO',
          url: 'https://leolabs.space/',
        },
        {
          rotulo: 'UNOOSA Outer Space Objects Index',
          contexto: 'Registro internacional de objetos lançados',
          url: 'https://www.unoosa.org/oosa/osoindex/',
        },
      ],
    },
  },

  missao: {
    rotulo: 'A MISSÃO',
    titulo: 'O problema tem solução, e ela já começou.',
    subtitulo:
      'Limpar a órbita é difícil, mas não impossível. Tecnologia, regulação e responsabilidade estão sendo postas em prática agora.',

    // Contextualização do desafio Space Connect (Global Solutions FIAP 2026/1).
    contexto: {
      rotulo: 'O DESAFIO',
      titulo: 'Space Connect: a nova economia espacial precisa de uma órbita viva.',
      paragrafos: [
        'A Global Solutions 2026 da FIAP propõe pensar como o ecossistema espacial pode resolver problemas concretos da sociedade. Hoje, satélites monitoram o clima, orientam o agronegócio, evitam desastres e conectam regiões remotas. Tudo isso depende de uma órbita utilizável.',
        'O SENTINELA é uma resposta a esse desafio: uma plataforma cinematográfica de monitoramento e conscientização sobre detritos orbitais. Usa dados públicos da CelesTrak e ESA para visualizar em tempo real o congestionamento da órbita e mostrar, em linguagem clara, por que isso ameaça toda a infraestrutura espacial.',
      ],
      marcadores: [
        { rotulo: 'PROBLEMA', valor: 'Congestionamento orbital' },
        { rotulo: 'SOLUÇÃO', valor: 'Visualização + dados públicos' },
        { rotulo: 'PÚBLICO', valor: 'Sociedade e tomadores de decisão' },
      ],
    },

    solucoes: [
      {
        icone: '🛰️',
        titulo: 'Remoção ativa de detritos',
        descricao:
          'Missões como a ClearSpace-1 (ESA) e a ADRAS-J (Astroscale) vão capturar e desorbitar objetos mortos com braços robóticos, redes e arpões.',
        marcador: 'EM DESENVOLVIMENTO',
      },
      {
        icone: '📜',
        titulo: 'Regulamentação internacional',
        descricao:
          'Diretrizes da ONU/COPUOS e a "regra dos 25 anos" (agora 5, nos EUA) exigem que satélites saiam de órbita ao fim da vida útil.',
        marcador: 'EM VIGOR',
      },
      {
        icone: '♻️',
        titulo: 'Descarte responsável',
        descricao:
          'Novos satélites já nascem com planos de desorbitação, propulsão para reentrada controlada e materiais que se desintegram na atmosfera.',
        marcador: 'PADRÃO EMERGENTE',
      },
      {
        icone: '📡',
        titulo: 'Rastreamento e prevenção',
        descricao:
          'Redes como o Space Surveillance Network e empresas como a LeoLabs monitoram detritos em tempo real e emitem alertas de colisão.',
        marcador: 'OPERACIONAL',
      },
    ],

    // Catálogo de tecnologias reais de remoção, com método e missão associada.
    tecnologias: {
      titulo: 'Tecnologias de remoção em desenvolvimento',
      legenda:
        'Como capturar um objeto morto que gira a 27.000 km/h sem gerar mais detritos? Diferentes engenheiros, diferentes apostas. Clique para ver cada método.',
      itens: [
        {
          codigo: 'TEC-01',
          nome: 'Braço robótico',
          missao: 'ClearSpace-1 (ESA, lançamento 2028)',
          principio:
            'A nave se aproxima do detrito, agarra com quatro garras articuladas e usa propulsão própria para reentrada controlada.',
          maturidade: 'TRL 6 · Demonstração espacial',
          desafio: 'Posicionar e capturar um objeto não cooperativo que gira sobre o próprio eixo.',
        },
        {
          codigo: 'TEC-02',
          nome: 'Rendezvous magnético',
          missao: 'ADRAS-J (Astroscale, Japão)',
          principio:
            'O caçador aproxima-se de corpos de foguete, faz rendezvous e prepara captura para missão seguinte.',
          maturidade: 'TRL 7 · Em órbita desde 2024',
          desafio: 'Operar a metros de um objeto sem ferramentas de aproximação cooperativa.',
        },
        {
          codigo: 'TEC-03',
          nome: 'Rede e arpão',
          missao: 'RemoveDEBRIS (Surrey/ESA, 2018)',
          principio:
            'Uma rede é disparada para envolver o objeto, ou um arpão o perfura, antes de ser puxado para reentrada.',
          maturidade: 'TRL 6 · Demonstração em órbita',
          desafio: 'Garantir captura sem fragmentar o objeto em mais detritos.',
        },
        {
          codigo: 'TEC-04',
          nome: 'Laser terrestre',
          principio:
            'Lasers de alta potência empurram detritos pequenos via pressão de fótons, alterando sua órbita até a reentrada.',
          maturidade: 'TRL 4 · Pesquisa',
          desafio: 'Coordenação internacional e risco de uso dual (arma antissatélite).',
        },
        {
          codigo: 'TEC-05',
          nome: 'Vela eletrodinâmica',
          principio:
            'Cabos condutores interagem com o campo magnético da Terra, gerando arrasto que desorbita o satélite sem combustível.',
          maturidade: 'TRL 5 · Testes em CubeSats',
          desafio: 'Confiabilidade a longo prazo e proteção contra micrometeoritos.',
        },
        {
          codigo: 'TEC-06',
          nome: 'Reentrada controlada',
          principio:
            'O próprio satélite reserva combustível para uma queima final que o joga no Oceano Pacífico (Ponto Nemo).',
          maturidade: 'TRL 9 · Operacional',
          desafio: 'Custo de massa adicional reservada apenas para o fim da vida útil.',
        },
      ],
    },

    // Marcos do esforço internacional para limpar a órbita.
    timeline: {
      titulo: 'Linha do tempo: o esforço para limpar o espaço',
      itens: [
        { ano: '1978', titulo: 'A síndrome ganha nome', detalhe: 'Donald Kessler publica o paper que descreve a reação em cadeia.' },
        { ano: '2007', titulo: 'O alerta', detalhe: 'Teste antissatélite chinês contra o Fengyun-1C cria a maior nuvem de detritos da história.' },
        { ano: '2009', titulo: 'A primeira colisão', detalhe: 'Iridium 33 e Cosmos 2251 colidem acidentalmente. 2.300 novos detritos.' },
        { ano: '2018', titulo: 'Prova de conceito', detalhe: 'RemoveDEBRIS demonstra captura por rede e arpão em órbita.' },
        { ano: '2022', titulo: 'Regra dos 5 anos', detalhe: 'FCC nos EUA reduz prazo de desorbitação obrigatória de 25 para 5 anos.' },
        { ano: '2024', titulo: 'Primeira inspeção comercial', detalhe: 'ADRAS-J alcança e fotografa um corpo de foguete japonês abandonado.' },
        { ano: '2028', titulo: 'Primeira remoção comercial', detalhe: 'ClearSpace-1 deve capturar e desorbitar o adaptador VESPA.' },
      ],
    },

    chamada: {
      titulo: 'A órbita é um bem comum. Proteger é tarefa de todos.',
      descricao:
        'Cada satélite lançado com responsabilidade e cada detrito removido conta. O SENTINELA existe para que mais pessoas enxerguem o que está em jogo.',
    },

    // Recursos categorizados em três grupos.
    recursos: {
      titulo: 'Recursos e fontes',
      grupos: [
        {
          rotulo: 'Agências e órgãos oficiais',
          itens: [
            { rotulo: 'ESA · Space Debris Office', url: 'https://www.esa.int/Space_Safety/Space_Debris' },
            { rotulo: 'NASA · Orbital Debris Program Office', url: 'https://orbitaldebris.jsc.nasa.gov/' },
            { rotulo: 'UNOOSA · Long-term Sustainability', url: 'https://www.unoosa.org/oosa/en/ourwork/topics/long-term-sustainability-of-outer-space-activities.html' },
            { rotulo: 'Space-Track.org · Catálogo NORAD', url: 'https://www.space-track.org' },
          ],
        },
        {
          rotulo: 'Empresas e missões',
          itens: [
            { rotulo: 'ClearSpace-1 (ESA)', url: 'https://www.esa.int/Space_Safety/ClearSpace-1' },
            { rotulo: 'Astroscale · ADRAS-J', url: 'https://astroscale.com/missions/adras-j/' },
            { rotulo: 'LeoLabs · monitoramento comercial', url: 'https://leolabs.space/' },
            { rotulo: 'RemoveDEBRIS (Surrey)', url: 'https://www.surrey.ac.uk/surrey-space-centre/missions/removedebris' },
          ],
        },
        {
          rotulo: 'Dados abertos e leitura',
          itens: [
            { rotulo: 'CelesTrak · TLEs em tempo real', url: 'https://celestrak.org/' },
            { rotulo: 'ESA Space Environment Report 2025', url: 'https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025' },
            { rotulo: 'NASA Black Marble · texturas', url: 'https://visibleearth.nasa.gov/images/55167' },
            { rotulo: 'satellite.js · propagação SGP4', url: 'https://www.npmjs.com/package/satellite.js' },
          ],
        },
      ],
    },

    // Identificação do projeto acadêmico.
    sobre: {
      rotulo: 'SOBRE O PROJETO',
      titulo: 'SENTINELA',
      descricao:
        'Plataforma desenvolvida como entrega da Global Solutions 1 de 2026 da FIAP (Space Connect). O código-fonte é aberto e usa apenas dados públicos.',
      stackRotulo: 'STACK',
      stack: 'React 18 · TypeScript · Three.js · satellite.js · GSAP · Recharts · Tailwind · Vite',
      fonteRotulo: 'FONTES DE DADOS',
      fonte: 'CelesTrak (TLEs · NORAD) · ESA Space Environment Report 2025 · NASA ODPO',
      autorRotulo: 'AUTORIA',
    },
  },

  emConstrucao: {
    titulo: 'Em construção',
    descricao: 'Esta seção será desenvolvida nas próximas fases do projeto.',
  },

  // Identificação acadêmica para a entrega da Global Solutions 1 de 2026.
  autor: {
    nome: 'Pedro Ruvieri Cavariani',
    rm: 'RM 551380',
    turma: '4SIOA',
    curso: 'Sistemas de Informação',
    instituicao: 'FIAP',
    projeto: 'Global Solutions 2026/1 · Space Connect',
    ano: 2026,
    assinatura: 'Pedro Ruvieri Cavariani · RM 551380 · 4SIOA · FIAP',
  },
} as const;

// Estatística estática de detritos rastreados (atualizada por fonte · ESA 2025).
export const DETRITOS_RASTREADOS_TOTAL = 36500;

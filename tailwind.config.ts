import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

// Configuração do Tailwind — tema "Crise Fria" do SENTINELA
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fundos
        fundo: {
          principal: '#050810',
          secundario: '#0a0f1e',
          elevado: '#111827',
        },
        // Destaque principal — azul-gelo
        primaria: {
          DEFAULT: '#4fc3f7',
          hover: '#81d4fa',
          dim: '#1a4a6b',
        },
        // Alerta / perigo — laranja-fogo
        alerta: {
          DEFAULT: '#ff5722',
          hover: '#ff7043',
          dim: '#5c1a00',
        },
        // Texto
        texto: {
          principal: '#e0e0e0',
          secundario: '#8899aa',
          destaque: '#ffffff',
        },
        acento: '#1a237e',
        borda: '#1e2d4a',
      },
      fontFamily: {
        marca: ['"Chakra Petch"', 'sans-serif'],
        titulo: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primaria': '0 0 20px rgba(79, 195, 247, 0.15)',
        'glow-alerta': '0 0 20px rgba(255, 87, 34, 0.2)',
      },
      backgroundImage: {
        'gradiente-fundo':
          'radial-gradient(ellipse at 20% 50%, #0d1b3e 0%, #050810 60%)',
      },
      keyframes: {
        'subir-suave': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'subir-suave': 'subir-suave 0.5s ease-out both',
      },
    },
  },
  plugins: [typography],
};

export default config;

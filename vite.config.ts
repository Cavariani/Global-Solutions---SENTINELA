import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import {
  GRUPOS_PERMITIDOS,
  buscarTLEsDoCelesTrak,
  semearCacheFonte,
  lerCacheFonte,
} from './src/servicos/celestrak-fonte';
import type { DadosTLE } from './src/tipos/orbital';

// Diretório de cache em disco para o dev — sobrevive a reinícios do servidor.
// Importante porque o CelesTrak bloqueia (403) re-downloads do mesmo grupo por ~2h.
const DIR_CACHE = path.resolve(process.cwd(), '.cache', 'celestrak');

interface ArquivoCache {
  objetos: DadosTLE[];
  gravadoEm: number;
}

function caminhoCache(grupo: string): string {
  return path.join(DIR_CACHE, `${grupo}.json`);
}

function lerCacheDisco(grupo: string): ArquivoCache | null {
  try {
    const caminho = caminhoCache(grupo);
    if (!existsSync(caminho)) return null;
    return JSON.parse(readFileSync(caminho, 'utf-8')) as ArquivoCache;
  } catch {
    return null;
  }
}

function gravarCacheDisco(grupo: string, dados: ArquivoCache): void {
  try {
    if (!existsSync(DIR_CACHE)) mkdirSync(DIR_CACHE, { recursive: true });
    writeFileSync(caminhoCache(grupo), JSON.stringify(dados), 'utf-8');
  } catch {
    // Cache em disco é best-effort; ignorar falhas de escrita.
  }
}

// Middleware de desenvolvimento que reproduz a Edge Function /api/celestrak.
// Usa a mesma lógica de fetch + parse da produção (módulo compartilhado) e adiciona
// uma camada de cache em disco para respeitar o limite de re-download do CelesTrak.
function pluginApiCelesTrak(): Plugin {
  return {
    name: 'api-celestrak-dev',
    configureServer(servidor) {
      servidor.middlewares.use('/api/celestrak', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://local');
        const grupo = url.searchParams.get('grupo') ?? 'active';
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (!GRUPOS_PERMITIDOS.has(grupo)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ erro: 'Grupo inválido', grupo }));
          return;
        }

        // Semeia o cache em memória com o que houver em disco — assim, se o CelesTrak
        // recusar (403) o re-download, a busca cai de volta nessa cópia.
        const doDisco = lerCacheDisco(grupo);
        if (doDisco) {
          semearCacheFonte(grupo, doDisco.objetos, doDisco.gravadoEm);
        }

        try {
          const objetos = await buscarTLEsDoCelesTrak(grupo);
          // Persiste a cópia atual em disco (usando o timestamp real do cache).
          const atual = lerCacheFonte(grupo);
          if (atual) gravarCacheDisco(grupo, atual);

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              objetos,
              totalObjetos: objetos.length,
              atualizadoEm: new Date(
                atual?.gravadoEm ?? Date.now(),
              ).toISOString(),
              fonte: 'CelesTrak',
              grupo,
            }),
          );
        } catch (erro) {
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              erro: 'Falha ao consultar o CelesTrak',
              detalhe: erro instanceof Error ? erro.message : String(erro),
              grupo,
            }),
          );
        }
      });
    },
  };
}

// Configuração do Vite — bundler do projeto SENTINELA
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pluginApiCelesTrak()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Bundle splitting: Three.js em chunk separado (regra de performance do projeto)
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          orbital: ['satellite.js'],
        },
      },
    },
  },
});

// Estrutura de rotas do SENTINELA. ÓRBITA carrega imediatamente (ponto de entrada);
// as demais abas usam lazy loading (regra de performance do projeto).
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navegacao } from '@/componentes/Navegacao';
import { RolarParaTopo } from '@/componentes/RolarParaTopo';
import { TransicaoPagina } from '@/componentes/TransicaoPagina';
import { ProvedorIntro } from '@/estado/IntroContexto';
import Orbita from '@/abas/Orbita/Orbita';

const Crise = lazy(() => import('@/abas/Crise/Crise'));
const Dados = lazy(() => import('@/abas/Dados/Dados'));
const Missao = lazy(() => import('@/abas/Missao/Missao'));

// Fallback simples enquanto uma aba lazy é carregada.
function CarregandoAba() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fundo-principal">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primaria-dim border-t-primaria" />
    </div>
  );
}

export default function App() {
  return (
    <ProvedorIntro>
      <RolarParaTopo />
      <Navegacao />
      <Suspense fallback={<CarregandoAba />}>
        <Routes>
          <Route path="/" element={<Navigate to="/orbita" replace />} />
          <Route path="/orbita" element={<Orbita />} />
          <Route path="/crise" element={<Crise />} />
          <Route path="/dados" element={<Dados />} />
          <Route
            path="/missao"
            element={
              <TransicaoPagina>
                <Missao />
              </TransicaoPagina>
            }
          />
          <Route path="*" element={<Navigate to="/orbita" replace />} />
        </Routes>
      </Suspense>
    </ProvedorIntro>
  );
}

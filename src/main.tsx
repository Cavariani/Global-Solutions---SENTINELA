import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';

const elementoRaiz = document.getElementById('root');
if (!elementoRaiz) {
  throw new Error('Elemento #root não encontrado no documento.');
}

createRoot(elementoRaiz).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

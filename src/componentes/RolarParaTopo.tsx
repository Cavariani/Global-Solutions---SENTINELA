// Reseta o scroll ao topo a cada troca de rota.
// Sem isso, navegar de uma aba longa (DADOS) para outra (MISSÃO) preserva
// a posição da rolagem anterior — confunde o usuário.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RolarParaTopo() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

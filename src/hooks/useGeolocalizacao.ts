// Hook de geolocalização · usado para calcular "acima de você agora" no HUD.
// Não pede permissão automaticamente; o usuário aciona via botão (boa prática de UX).
import { useCallback, useState } from 'react';

interface PosicaoUsuario {
  lat: number;
  lng: number;
}

interface EstadoGeolocalizacao {
  posicao: PosicaoUsuario | null;
  // true se o navegador suporta a API de geolocalização.
  disponivel: boolean;
  solicitar: () => void;
}

export function useGeolocalizacao(): EstadoGeolocalizacao {
  const disponivel =
    typeof navigator !== 'undefined' && 'geolocation' in navigator;
  const [posicao, setPosicao] = useState<PosicaoUsuario | null>(null);

  const solicitar = useCallback(() => {
    if (!disponivel) return;
    navigator.geolocation.getCurrentPosition(
      (resultado) => {
        setPosicao({
          lat: resultado.coords.latitude,
          lng: resultado.coords.longitude,
        });
      },
      () => {
        // Permissão negada ou indisponível · mantém null silenciosamente.
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, [disponivel]);

  return { posicao, disponivel, solicitar };
}

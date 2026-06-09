// Hook de dados orbitais · busca os TLEs dos grupos solicitados em paralelo,
// já associando cada TLE à sua categoria visual. Mantém estado de loading/erro.
import { useEffect, useState } from 'react';
import { buscarGrupoOrbital } from '@/servicos/celestrak';
import { CATEGORIA_POR_GRUPO, type GrupoCelesTrak } from '@/constantes/grupos';
import type { TLECategorizado } from '@/tipos/orbital';

interface EstadoDadosOrbitais {
  objetos: TLECategorizado[];
  carregando: boolean;
  erro: string | null;
  atualizadoEm: Date | null;
}

// `grupos` deve ser estável entre renders (defina como constante fora do componente
// ou memoize) para não disparar refetch desnecessário.
export function useDadosOrbitais(
  grupos: GrupoCelesTrak[],
): EstadoDadosOrbitais {
  const [estado, setEstado] = useState<EstadoDadosOrbitais>({
    objetos: [],
    carregando: true,
    erro: null,
    atualizadoEm: null,
  });

  // Chave estável para o efeito · evita refetch quando o array muda de referência
  // mas mantém o mesmo conteúdo.
  const chaveGrupos = grupos.join(',');

  useEffect(() => {
    let cancelado = false;
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }));

    const listaGrupos = chaveGrupos.split(',') as GrupoCelesTrak[];

    // allSettled: um grupo que falha não derruba os demais. Só consideramos erro
    // se TODOS os grupos falharem.
    Promise.allSettled(
      listaGrupos.map(async (grupo) => {
        const tles = await buscarGrupoOrbital(grupo);
        const categoria = CATEGORIA_POR_GRUPO[grupo];
        return tles.map<TLECategorizado>((tle) => ({ tle, categoria, grupo }));
      }),
    ).then((resultados) => {
      if (cancelado) return;

      const objetos = resultados
        .filter(
          (r): r is PromiseFulfilledResult<TLECategorizado[]> =>
            r.status === 'fulfilled',
        )
        .flatMap((r) => r.value);

      const todosFalharam = resultados.every((r) => r.status === 'rejected');

      if (todosFalharam) {
        const primeiroErro = resultados.find(
          (r): r is PromiseRejectedResult => r.status === 'rejected',
        );
        const motivo = primeiroErro?.reason;
        setEstado({
          objetos: [],
          carregando: false,
          erro: motivo instanceof Error ? motivo.message : 'Erro desconhecido',
          atualizadoEm: null,
        });
        return;
      }

      // Registra grupos que falharam (sem quebrar a experiência).
      resultados.forEach((r, i) => {
        if (r.status === 'rejected') {
          // eslint-disable-next-line no-console
          console.warn(
            `[SENTINELA] Grupo "${listaGrupos[i]}" não carregou:`,
            r.reason,
          );
        }
      });

      setEstado({
        objetos,
        carregando: false,
        erro: null,
        atualizadoEm: new Date(),
      });
    });

    return () => {
      cancelado = true;
    };
  }, [chaveGrupos]);

  return estado;
}

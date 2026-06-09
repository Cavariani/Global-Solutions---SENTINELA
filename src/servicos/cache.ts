// Cache em memória com TTL · evita refazer fetch dos TLEs a cada renderização.
// Regra do projeto: NÃO usar localStorage; cache vive em memória (TTL 4h).

interface EntradaCache<T> {
  valor: T;
  expiraEm: number; // timestamp em ms
}

const TTL_PADRAO_MS = 4 * 60 * 60 * 1000; // 4 horas

const armazenamento = new Map<string, EntradaCache<unknown>>();

// Lê do cache se ainda válido; senão retorna null.
export function lerCache<T>(chave: string): T | null {
  const entrada = armazenamento.get(chave);
  if (!entrada) return null;
  if (Date.now() > entrada.expiraEm) {
    armazenamento.delete(chave);
    return null;
  }
  return entrada.valor as T;
}

// Grava no cache com TTL (padrão 4h).
export function gravarCache<T>(
  chave: string,
  valor: T,
  ttlMs: number = TTL_PADRAO_MS,
): void {
  armazenamento.set(chave, { valor, expiraEm: Date.now() + ttlMs });
}

// Limpa todo o cache (útil em testes ou refresh manual).
export function limparCache(): void {
  armazenamento.clear();
}

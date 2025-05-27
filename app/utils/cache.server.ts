type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

let someCache: Record<string, CacheEntry<any>> = {};
const cache_ttl = 1000 * 60 * 60 * 5;

export function getCached<T>(key: string): T | null {
  const cachedEntry = someCache[key];
  if (cachedEntry && Date.now() - cachedEntry.timestamp < cache_ttl) {
    return cachedEntry.data as T;
  }
  return null;
}

export function setInCached<T>(key: string, data: T): void {
  someCache[key] = {
    data,
    timestamp: Date.now(),
  };
}

export async function clearCache(key: string): Promise<void> {
  delete someCache[key];
}

export function clearAllCache(): void {
  someCache = {};
}

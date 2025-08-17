// Cache API for Apex framework

// Cache entry interface
export interface CacheEntry<T = any> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

// Cache options
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

// Cache interface
export interface Cache {
  set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
}

// In-memory cache implementation
export class InMemoryCache implements Cache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number;
  private defaultTtl: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTtl = options.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  async set<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
    // Check if we've reached the maximum size
    if (this.cache.size >= this.maxSize) {
      // Remove the oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const ttl = options?.ttl ?? this.defaultTtl;
    const now = Date.now();

    this.cache.set(key, {
      value,
      expiresAt: now + ttl,
      createdAt: now
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async size(): Promise<number> {
    // Clean up expired entries
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }

    return this.cache.size;
  }
}

// Global cache instance
let globalCache: Cache | null = null;

// Initialize the global cache
export function initializeCache(options: CacheOptions = {}): Cache {
  if (!globalCache) {
    globalCache = new InMemoryCache(options);
  }
  return globalCache;
}

// Get the global cache instance
export function getCache(): Cache {
  if (!globalCache) {
    globalCache = new InMemoryCache();
  }
  return globalCache;
}

// Cache set function
export async function cacheSet<T>(key: string, value: T, options?: { ttl?: number }): Promise<void> {
  const cache = getCache();
  await cache.set(key, value, options);
}

// Cache get function
export async function cacheGet<T>(key: string): Promise<T | null> {
  const cache = getCache();
  return await cache.get<T>(key);
}

// Cache delete function
export async function cacheDelete(key: string): Promise<boolean> {
  const cache = getCache();
  return await cache.delete(key);
}

// Cache clear function
export async function cacheClear(): Promise<void> {
  const cache = getCache();
  await cache.clear();
}

// Cache has function
export async function cacheHas(key: string): Promise<boolean> {
  const cache = getCache();
  return await cache.has(key);
}

// Revalidate function for ISR
export async function revalidate(path: string): Promise<void> {
  console.log(`Revalidating path: ${path}`);
  // In a real implementation, this would trigger a rebuild of the page
  // For now, we'll just log the revalidation
}

// Prerender configuration
export interface PrerenderConfig {
  cache?: {
    maxAge?: number; // Max age in seconds
  };
}

// Export cache primitives
export const cache = {
  set: cacheSet,
  get: cacheGet,
  delete: cacheDelete,
  clear: cacheClear,
  has: cacheHas,
  revalidate
};
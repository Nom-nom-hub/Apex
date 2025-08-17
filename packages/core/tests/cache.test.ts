import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCache, cacheSet, cacheGet, cacheDelete, cacheClear, cacheHas, revalidate } from '../src/cache';

describe('Cache', () => {
  beforeEach(async () => {
    // Clear the cache before each test
    await cacheClear();
  });

  it('should set and get values', async () => {
    await cacheSet('key1', 'value1');
    const result = await cacheGet<string>('key1');
    expect(result).toBe('value1');
  });

  it('should return null for non-existent keys', async () => {
    const result = await cacheGet<string>('non-existent');
    expect(result).toBeNull();
  });

  it('should delete values', async () => {
    await cacheSet('key1', 'value1');
    let result = await cacheGet<string>('key1');
    expect(result).toBe('value1');

    const deleted = await cacheDelete('key1');
    expect(deleted).toBe(true);

    result = await cacheGet<string>('key1');
    expect(result).toBeNull();
  });

  it('should handle expiration', async () => {
    // Set a value with a short TTL
    await cacheSet('key1', 'value1', { ttl: 10 });
    
    // Value should be available immediately
    let result = await cacheGet<string>('key1');
    expect(result).toBe('value1');
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 20));
    
    // Value should be expired
    result = await cacheGet<string>('key1');
    expect(result).toBeNull();
  });

  it('should check if key exists', async () => {
    await cacheSet('key1', 'value1');
    let exists = await cacheHas('key1');
    expect(exists).toBe(true);
    
    const deleted = await cacheDelete('key1');
    expect(deleted).toBe(true);
    
    exists = await cacheHas('key1');
    expect(exists).toBe(false);
  });

  it('should clear all values', async () => {
    await cacheSet('key1', 'value1');
    await cacheSet('key2', 'value2');
    
    let size = await new InMemoryCache().size();
    expect(size).toBe(2);
    
    await cacheClear();
    
    size = await new InMemoryCache().size();
    expect(size).toBe(0);
  });

  it('should handle revalidation', async () => {
    // This is a simple test for the revalidate function
    // In a real implementation, this would trigger a rebuild
    await expect(revalidate('/test-path')).resolves.toBeUndefined();
  });
});
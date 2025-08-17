# Caching and ISR Documentation

## Overview

Apex provides powerful caching primitives and Incremental Static Regeneration (ISR) capabilities to optimize your application's performance.

## Cache API

The cache API provides a simple interface for storing and retrieving data with automatic expiration.

### Basic Usage

```typescript
import { cache } from '@apex/core';

// Set a value in the cache
await cache.set('user-123', {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
}, { ttl: 5 * 60 * 1000 }); // 5 minutes

// Get a value from the cache
const user = await cache.get('user-123');
if (user) {
  console.log('User from cache:', user);
} else {
  console.log('User not in cache');
}

// Delete a value from the cache
await cache.delete('user-123');

// Check if a key exists in the cache
const exists = await cache.has('user-123');
console.log('User exists in cache:', exists);

// Clear all values from the cache
await cache.clear();
```

### Cache Methods

#### `cache.set(key, value, options?)`

Sets a value in the cache.

- `key`: String identifier for the cache entry
- `value`: Any serializable value to store
- `options`: Optional configuration object
  - `ttl`: Time to live in milliseconds (default: 5 minutes)

#### `cache.get(key)`

Retrieves a value from the cache.

- `key`: String identifier for the cache entry
- Returns: The stored value or `null` if not found/expired

#### `cache.delete(key)`

Deletes a value from the cache.

- `key`: String identifier for the cache entry
- Returns: `true` if the entry existed and was deleted, `false` otherwise

#### `cache.has(key)`

Checks if a key exists in the cache.

- `key`: String identifier for the cache entry
- Returns: `true` if the entry exists and hasn't expired, `false` otherwise

#### `cache.clear()`

Clears all values from the cache.

#### `cache.revalidate(path)`

Triggers revalidation for a specific path.

- `path`: Path to revalidate

## Incremental Static Regeneration (ISR)

ISR allows you to statically generate pages at request time, providing the benefits of static sites with the flexibility of server-side rendering.

### Prerender Configuration

Configure ISR by exporting a `prerender` object from your route:

```typescript
// app/routes/blog/$slug.page.tsx
import { PrerenderConfig } from '@apex/core';

export const prerender: PrerenderConfig = {
  cache: {
    maxAge: 60 // Cache for 60 seconds
  }
};

export async function loader({ params }) {
  // This loader will be called during static generation
  // and then every 60 seconds for revalidation
  const post = await fetchPost(params.slug);
  return { post };
}

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Revalidation Strategies

#### Time-Based Revalidation

Set a fixed time interval for revalidation:

```typescript
export const prerender = {
  cache: {
    maxAge: 3600 // Revalidate every hour
  }
};
```

#### On-Demand Revalidation

Trigger revalidation programmatically:

```typescript
import { cache, revalidate } from '@apex/core';

export async function action({ request }) {
  const formData = await request.formData();
  const postId = formData.get('postId');
  
  if (postId) {
    // Invalidate cache for this post
    await cache.delete(`post-${postId}`);
    
    // Trigger revalidation
    await revalidate(`/blog/${postId}`);
  }
}
```

## Static Site Generation

Generate static HTML files for deployment to CDNs or static hosting providers.

### Deploy Command

Use the `apex deploy` command to generate static files:

```bash
# Generate static site with default adapter
apex deploy

# Generate static site with specific adapter
apex deploy --adapter=static

# Generate static site to custom output directory
apex deploy --out-dir=./public
```

### Output Structure

The deploy command generates the following structure:

```
dist/static/
├── index.html          # Root page
├── about/
│   └── index.html      # About page
├── blog/
│   ├── first-post/
│   │   └── index.html  # Blog post
│   └── index.html      # Blog index
├── manifest.json       # Revalidation metadata
└── robots.txt          # SEO directives
```

### Manifest File

The generated `manifest.json` contains metadata for revalidation:

```json
{
  "version": "1.0.0",
  "generatedAt": "2023-01-01T00:00:00.000Z",
  "routes": [
    {
      "path": "/",
      "prerender": {
        "cache": {
          "maxAge": 60
        }
      },
      "lastModified": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Best Practices

### Cache Keys

Use descriptive cache keys that include relevant identifiers:

```typescript
// Good
const userCacheKey = `user-${userId}`;
const postCacheKey = `post-${postId}-${locale}`;

// Avoid
const cacheKey = 'data';
```

### TTL Values

Set appropriate TTL values based on your data's volatility:

```typescript
// Frequently changing data
await cache.set('stock-price-AAPL', price, { ttl: 30 * 1000 }); // 30 seconds

// Infrequently changing data
await cache.set('user-profile-123', profile, { ttl: 24 * 60 * 60 * 1000 }); // 24 hours
```

### Error Handling

Always handle cache misses gracefully:

```typescript
async function getUser(userId) {
  try {
    // Try to get from cache first
    let user = await cache.get(`user-${userId}`);
    
    if (!user) {
      // Fetch from database if not in cache
      user = await fetchUserFromDatabase(userId);
      
      // Store in cache for future requests
      await cache.set(`user-${userId}`, user, { ttl: 5 * 60 * 1000 });
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    // Fallback to direct database fetch
    return await fetchUserFromDatabase(userId);
  }
}
```

## Performance Considerations

### Memory Usage

The default cache implementation uses an in-memory store with a maximum size of 1000 entries. For larger applications, consider using a distributed cache like Redis.

### Cache Invalidation

Implement cache invalidation strategies to ensure data freshness:

```typescript
// Invalidate related cache entries when data changes
async function updateUser(userId, updates) {
  const updatedUser = await updateUserInDatabase(userId, updates);
  
  // Update main user cache
  await cache.set(`user-${userId}`, updatedUser);
  
  // Invalidate related caches
  await cache.delete(`user-posts-${userId}`);
  await cache.delete(`user-followers-${userId}`);
  
  return updatedUser;
}
```

## Troubleshooting

### Cache Misses

If you're experiencing frequent cache misses:

1. Check TTL values - they might be too short
2. Verify cache keys are consistent between set/get operations
3. Monitor memory usage to ensure cache isn't being evicted

### Stale Data

If you're seeing stale data:

1. Implement proper cache invalidation
2. Reduce TTL values for frequently changing data
3. Use on-demand revalidation for critical updates

## Advanced Topics

### Custom Cache Adapters

Implement custom cache adapters for specialized use cases:

```typescript
import { Cache } from '@apex/core';

class RedisCache implements Cache {
  private redisClient;
  
  constructor(redisClient) {
    this.redisClient = redisClient;
  }
  
  async set(key, value, options = {}) {
    const ttl = options.ttl || 5 * 60 * 1000;
    await this.redisClient.setex(key, Math.floor(ttl / 1000), JSON.stringify(value));
  }
  
  async get(key) {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  // Implement other Cache methods...
}
```

### Cache Warming

Pre-populate the cache with frequently accessed data:

```typescript
// Warm cache on application startup
async function warmCache() {
  const popularPosts = await fetchPopularPosts();
  for (const post of popularPosts) {
    await cache.set(`post-${post.id}`, post, { ttl: 60 * 60 * 1000 }); // 1 hour
  }
}
```
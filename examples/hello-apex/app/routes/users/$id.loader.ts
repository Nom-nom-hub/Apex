import { cache } from '@apex/core';

export async function loader({ params }: { params: any }) {
  // Try to get data from cache first
  const cacheKey = `user-${params.id}`;
  let userData = await cache.get(cacheKey);
  
  if (!userData) {
    // Simulate fetching user data from an API
    console.log(`Fetching user data for user ${params.id}...`);
    
    // In a real implementation, this would be an actual API call
    userData = {
      id: params.id,
      name: `User ${params.id}`,
      email: `user${params.id}@example.com`,
      lastUpdated: new Date().toISOString()
    };
    
    // Cache the data for 5 minutes
    await cache.set(cacheKey, userData, { ttl: 5 * 60 * 1000 });
  } else {
    console.log(`Using cached data for user ${params.id}`);
  }
  
  return {
    user: userData
  };
}
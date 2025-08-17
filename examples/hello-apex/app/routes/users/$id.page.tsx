import { cache, PrerenderConfig } from '@apex/core';

// Prerender configuration for ISR
export const prerender: PrerenderConfig = {
  cache: {
    maxAge: 60 // Cache for 60 seconds
  }
};

// Loader function that uses caching
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

// Action function for handling form submissions
export async function action({ request }: { request: Request }) {
  // Parse form data
  const formData = await request.formData();
  const userId = formData.get('userId');
  
  if (userId) {
    // Invalidate cache for this user
    const cacheKey = `user-${userId}`;
    await cache.delete(cacheKey);
    
    console.log(`Cache invalidated for user ${userId}`);
  }
  
  // Redirect back to the page
  return {
    redirectTo: `/users/${userId}`
  };
}

// Default export is the React component
export default function UserPage({ user }: { user: any }) {
  return (
    <div>
      <h1>User Details</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Last Updated: {user.lastUpdated}</p>
      
      <form method="post">
        <input type="hidden" name="userId" value={user.id} />
        <button type="submit">Refresh User Data</button>
      </form>
    </div>
  );
}
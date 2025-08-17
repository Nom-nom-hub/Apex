import { cache, revalidate } from '@apex/core';

export async function action({ request }: { request: Request }) {
  // Parse form data
  const formData = await request.formData();
  const userId = formData.get('userId');
  
  if (userId) {
    // Invalidate cache for this user
    const cacheKey = `user-${userId}`;
    await cache.delete(cacheKey);
    
    // Revalidate the page
    await revalidate(`/users/${userId}`);
    
    console.log(`Cache invalidated and page revalidated for user ${userId}`);
  }
  
  // Redirect back to the page
  return {
    redirect: `/users/${userId}`
  };
}
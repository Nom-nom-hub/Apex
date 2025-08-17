import { LoaderArgs } from '@apex/core';

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
}

export async function loader({ params }: LoaderArgs) {
  // In a real implementation, this would fetch from a database based on the slug
  const post: Post = {
    id: params.slug,
    title: `Blog Post: ${params.slug}`,
    content: `
      <p>This is the content of the blog post titled "${params.slug}". In a real application, 
      this content would be fetched from a database or CMS.</p>
      
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
      ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
      nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui 
      officia deserunt mollit anim id est laborum.</p>
      
      <h2>Subheading</h2>
      
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
      laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
      architecto beatae vitae dicta sunt explicabo.</p>
    `,
    date: '2023-01-15',
    author: {
      name: 'Jane Doe',
      avatar: 'https://via.placeholder.com/40'
    }
  };

  return { post };
}
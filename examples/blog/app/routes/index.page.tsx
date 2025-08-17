import React from 'react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

export async function loader() {
  // In a real implementation, this would fetch from a database
  const posts: Post[] = [
    {
      id: '1',
      title: 'Getting Started with Apex',
      excerpt: 'Learn how to build your first Apex application with this comprehensive guide.',
      date: '2023-01-15',
      slug: 'getting-started-with-apex'
    },
    {
      id: '2',
      title: 'Advanced Routing Techniques',
      excerpt: 'Explore advanced routing patterns and techniques in Apex.',
      date: '2023-01-20',
      slug: 'advanced-routing-techniques'
    },
    {
      id: '3',
      title: 'State Management in Apex',
      excerpt: 'Discover how to manage application state effectively in Apex.',
      date: '2023-01-25',
      slug: 'state-management-in-apex'
    }
  ];

  return { posts };
}

export default function BlogHomePage({ posts }: { posts: Post[] }) {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </a>
                </h3>
                <p className="text-gray-500 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <time className="text-sm text-gray-500">{post.date}</time>
                  <a 
                    href={`/blog/${post.slug}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
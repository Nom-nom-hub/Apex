import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export async function loader() {
  // In a real implementation, this would fetch from a database
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Headphones',
      price: 199.99,
      image: 'https://via.placeholder.com/300x300',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Wireless Keyboard',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300',
      rating: 4.2
    },
    {
      id: '3',
      name: 'Smart Watch',
      price: 249.99,
      image: 'https://via.placeholder.com/300x300',
      rating: 4.8
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      price: 129.99,
      image: 'https://via.placeholder.com/300x300',
      rating: 4.0
    }
  ];

  return { products };
}

export default function EcommerceHomePage({ products }: { products: Product[] }) {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href={`/products/${product.id}`} className="hover:text-gray-900">
                  {product.name}
                </a>
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
              <div className="mt-1 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-500">({product.rating})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
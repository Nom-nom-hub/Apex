import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

export async function loader({ params }: { params: { id: string } }) {
  // In a real implementation, this would fetch from a database
  const product: Product = {
    id: params.id,
    name: 'Premium Headphones',
    description: 'Experience crystal-clear audio with our premium headphones. Featuring noise cancellation technology and 30-hour battery life.',
    price: 199.99,
    image: 'https://via.placeholder.com/600x600',
    rating: 4.5,
    category: 'Electronics'
  };

  return { product };
}

export default function ProductDetailPage({ product }: { product: Product }) {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-0">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img 
                className="h-96 w-full object-cover md:h-full md:w-full" 
                src={product.image} 
                alt={product.name} 
              />
            </div>
            <div className="p-8 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {product.category}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
              
              <div className="mt-4 flex items-center">
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
                <span className="ml-2 text-gray-600">{product.rating} rating</span>
              </div>
              
              <p className="mt-4 text-gray-500">{product.description}</p>
              
              <div className="mt-6">
                <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select 
                    id="quantity" 
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
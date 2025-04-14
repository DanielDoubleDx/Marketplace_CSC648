import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Component skeleton loading of products
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 text-white animate-pulse">
      {/* Product Header Skeleton */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <div className="h-8 bg-gray-700 rounded-md w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded-md w-1/2 mb-4"></div>
        <div className="flex items-center mb-4">
          <div className="h-8 bg-gray-700 rounded-md w-1/4"></div>
        </div>

        {/* Message Seller Form */}
        <div className="mb-4">
          <div className="h-10 bg-gray-700 rounded-md w-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full p-3 mb-2 h-12 w-12"></div>
            <div className="h-4 bg-gray-700 rounded-md w-16"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full p-3 mb-2 h-12 w-12"></div>
            <div className="h-4 bg-gray-700 rounded-md w-16"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full p-3 mb-2 h-12 w-12"></div>
            <div className="h-4 bg-gray-700 rounded-md w-16"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full p-3 mb-2 h-12 w-12"></div>
            <div className="h-4 bg-gray-700 rounded-md w-16"></div>
          </div>
        </div>
      </div>

      {/* Product Description Skeleton */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <div className="h-6 bg-gray-700 rounded-md w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-4 bg-gray-700 rounded-md w-full"></div>
          ))}
        </div>
      </div>

      {/* Seller Information Skeleton */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <div className="h-6 bg-gray-700 rounded-md w-1/3 mb-4"></div>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
          <div>
            <div className="h-5 bg-gray-700 rounded-md w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-md w-40 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-md w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchProductDetail = async () => {
      try {
        console.log('Fetching data from API...');
        const response = await fetch('http://13.52.231.140:3001/api/search');
        const data = await response.json();
        console.log('API Response:', data);

        const foundProduct = data.items.find(p => p.listing_id === parseInt(id));
        console.log('Found product:', foundProduct);

        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert('Message sent: ' + message);
    setMessage('');
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-white text-center text-xl">
            {error || "Product not found"}
          </p>
          <div className="text-center mt-4">
            <Link to="/" className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Product Header */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <h2 className="text-xl font-bold mb-4">{product.category_name}</h2>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold">${product.price}</span>
          <span className="ml-2 text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
        </div>

        {/* Message Seller Form */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <span>Send a message to seller</span>
          </div>
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              placeholder="Hello, is this item still available?"
              className="flex-grow p-3 rounded-l-lg text-gray-900 focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-r-lg hover:bg-green-600 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <button className="bg-gray-700 rounded-full p-3 mb-2 hover:bg-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="text-sm">Alerts</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-gray-700 rounded-full p-3 mb-2 hover:bg-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <span className="text-sm">Make Offer</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-gray-700 rounded-full p-3 mb-2 hover:bg-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <span className="text-sm">Share</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="bg-gray-700 rounded-full p-3 mb-2 hover:bg-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <span className="text-sm">Save</span>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="space-y-2">{product.product_desc || "No description available"}</p>
      </div>

      {/* Seller Information */}
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Seller Information</h2>
          <Link to={`/seller`} className="text-green-500 hover:underline">
            Seller details
          </Link>

        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
          <div>
            <h3 className="font-semibold">{product.seller_name}</h3>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="text-gray-400">★</span>
                <span className="text-gray-400">★</span>
              </div>
              <span className="ml-1">{product.seller_rating}</span>
              <span className="ml-1 text-gray-400">({product.seller_reviews})</span>
            </div>
          </div>
        </div>
        <button className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600">
          View All Reviews
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-400">Condition</h3>
            <p>{product.condition || "No condition information"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 

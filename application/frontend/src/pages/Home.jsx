import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import listings from '../data/listings.json';

function ProductSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
}

function Home() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const products = listings.slice(0, 12);
  const row1 = products.slice(0, 4);
  const row2 = products.slice(4, 8);
  const row3 = products.slice(8, 12);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSearchEvent = (event) => {
      setLoading(true);
      setTimeout(() => {
        setSearchResults(event.detail.results);
        setSearchTitle('Search Results');
        setLoading(false);
      }, 800);
    };

    window.addEventListener('searchCompleted', handleSearchEvent);

    return () => {
      window.removeEventListener('searchCompleted', handleSearchEvent);
    };
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    if (search || category) {
      setLoading(true);
      setTimeout(() => {
        const savedResults = JSON.parse(localStorage.getItem('searchResults'));
        if (savedResults) {
          setSearchResults(savedResults);
          setSearchTitle(`Search Results: "${search}" ${category !== 'All' ? `- ${category}` : ''}`);
        }
        setLoading(false);
      }, 800);
    } else {
      setSearchResults(null);
      setSearchTitle('');
    }
  }, [searchParams]);

  const renderSkeletons = (count) => {
    return Array(count).fill(0).map((_, index) => (
      <ProductSkeleton key={index} />
    ));
  };

  return (
    <div className="container mx-auto">
      {/* Hero Banner */}
      {!searchResults && (
        <section className="relative h-[500px] rounded-lg overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-90"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-5xl font-bold mb-4">San Francisco State University Market</h1>
            <p className="text-xl mb-8">Your trusted online shopping destination for quality products and excellent service.</p>
          </div>
        </section>
      )}

      {/* Search Results Section */}
      {searchResults && (
        <section className="mt-20 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">{searchTitle}</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {renderSkeletons(8)}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-lg text-white text-center">
              <p className="text-xl">No products found matching your search.</p>
              <p className="mt-2">Please try again with different keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-white">{product.title}</h3>
                    <p className="text-gray-400">${Number(product.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Products Sections */}
      {!searchResults && (
        <>
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loading ? renderSkeletons(4) : row1.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-white">{product.title}</h3>
                    <p className="text-gray-400">${Number(product.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loading ? renderSkeletons(4) : row2.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-white">{product.title}</h3>
                    <p className="text-gray-400">${Number(product.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loading ? renderSkeletons(4) : row3.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-white">{product.title}</h3>
                    <p className="text-gray-400">${Number(product.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;

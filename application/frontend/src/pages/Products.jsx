import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import listings from '../data/listings.json';

function Products() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(listings);
  const [searchTerm, setSearchTerm] = useState("");

  // Get a unique list of categories from listings
  const categories = [...new Set(listings.map(product => product.category))];

  // Handle search functionality
  const handleSearch = () => {
    const filtered = listings.filter(product => {
      const matchesSearch = !searchTerm ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(filtered);
  };

  // Automatically search when filters change
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  // Read search results from URL and localStorage when the component mounts
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    if (search || category) {
      const searchResults = JSON.parse(localStorage.getItem('searchResults'));
      if (searchResults) {
        setFilteredProducts(searchResults);
      }
    } else {
      setFilteredProducts(listings);
    }

    return () => {
      if (!searchParams.get('search') && !searchParams.get('category')) {
        localStorage.removeItem('searchResults');
      }
    };
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer hover:text-blue-600 ${!selectedCategory ? 'text-blue-600' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </li>
              {categories.map(category => (
                <li
                  key={category}
                  className={`cursor-pointer hover:text-blue-600 ${selectedCategory === category ? 'text-blue-600' : ''}`}
                  onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort Section */}
          <div className="flex justify-end mb-6">
            <select
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                const sorted = [...filteredProducts].sort((a, b) => {
                  switch (e.target.value) {
                    case 'price-low-high':
                      return Number(a.price) - Number(b.price);
                    case 'price-high-low':
                      return Number(b.price) - Number(a.price);
                    case 'newest':
                      return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
                    default:
                      return 0;
                  }
                });
                setFilteredProducts(sorted);
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400 text-lg">No products match your search.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={`/images/${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-400 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg transition duration-300 ${page === 1 ? 'bg-primary-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              >
                {page}
              </button>
            ))}
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

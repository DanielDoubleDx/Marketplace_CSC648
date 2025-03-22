import React from 'react';

function Products() {
  return (
    <div className="container mx-auto">
      {/* Filter and Sort Section */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <select className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
          <select className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none">
            <option value="">Price Range</option>
            <option value="0-50">$0 - $50</option>
            <option value="51-100">$51 - $100</option>
            <option value="101-200">$101 - $200</option>
            <option value="201+">$201+</option>
          </select>
        </div>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none">
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
            <div className="aspect-square bg-gray-700"></div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Product Name</h3>
              <p className="text-gray-400 mb-2">Product description goes here...</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$99.99</span>
                <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
          Previous
        </button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-lg transition duration-300 ${page === 1 ? 'bg-primary-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
          >
            {page}
          </button>
        ))}
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
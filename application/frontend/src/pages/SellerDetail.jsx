import React from 'react';

function SellerDetail() {
  return (
    <div className="container mx-auto px-4 py-8 text-white space-y-8">
      {/* Avatar Section */}
      <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-6">
        <img
          alt="Seller Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">Name</h2>
        </div>
      </div>

      {/* About Me Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">About Me</h3>
      </div>

      {/* Rating Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Rating</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
          <span className="text-gray-400 ml-2">(5)</span>
        </div>
      </div>

      {/* Listings Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Listings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition duration-300"
            >
              <div className="aspect-square">
                <img
                  src={`/images/item-${id}.jpg`}
                  alt={`Item ${id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1">Sample Item {id}</h4>
                <p className="text-gray-400">$99.99</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerDetail;

import React from 'react';

function SellerDetail() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <section className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Avatar */}
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <img
              src="/images/avatar.png"
              alt="Default Seller Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>


          {/* Info Boxes */}
          <div className="space-y-4">
            {/* Name Box */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Name</h3>
            </div>

            {/* About Me Box */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">About Me</h3>
            </div>

            {/* Rating Box */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Rating</h3>
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
          </div>
        </div>

        {/* Seller's Products */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Seller's Products</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <div
                key={id}
                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={`/images/item-${id}.jpg`}
                    alt={`Sample ${id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="font-semibold text-white">Sample {id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SellerDetail;

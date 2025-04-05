import React from 'react';

function Home() {
  return (
    <div className="container mx-auto">
      {/* Hero Banner */}
      <section className="relative h-[500px] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 opacity-90"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">San Francisco State University Market</h1>
          <p className="text-xl mb-8">Your trusted online shopping destination for quality products and excellent service.</p>
        </div>
      </section>

      {/* New Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">New Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
              <div className="aspect-square bg-gray-700"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Product Name</h3>
                <p className="text-gray-400">$500.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
              <div className="aspect-square bg-gray-700"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">Product Name</h3>
                <p className="text-gray-400">$500.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
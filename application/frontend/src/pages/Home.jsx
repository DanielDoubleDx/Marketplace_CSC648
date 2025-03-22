import React from 'react';

function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-90"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl font-bold mb-4">San Francisco State University Market</h1>
          <p className="text-xl mb-8">Your trusted online shopping destination for quality products and excellent service.</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
            SHOP NOW
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
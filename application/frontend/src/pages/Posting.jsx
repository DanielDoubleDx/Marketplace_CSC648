import React from 'react';

const Posting = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      {/* Gray box wrapper like contact page */}
      <section className="w-full max-w-2xl bg-gray-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Listing Details</h1>

        {/* Photo Upload Box */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Photos:</label>
          <div className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-300 transition">
            <span className="text-4xl">＋</span>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Title:</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            placeholder="Enter item title"
          />
        </div>

        {/* Price Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Price:</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            placeholder="$0.00"
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <label className="block text-lg mb-2">Description:</label>
          <textarea
            rows="5"
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none resize-none"
            placeholder="Describe your item"
          ></textarea>
        </div>

        {/* Publish Button */}
        <div className="flex justify-center">
          <button className="bg-green-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-600 transition">
            Publish
          </button>
        </div>
      </section>
    </div>
  );
};

export default Posting;

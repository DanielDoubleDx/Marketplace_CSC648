import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [category, setCategory] = useState("All");
  const spanRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && selectRef.current) {
      const textWidth = spanRef.current.offsetWidth;
      selectRef.current.style.width = `${textWidth + 30}px`;
    }
  }, [category]);

  return (
    <header className="bg-gray-900 text-white py-3 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ease-in-out">
      <div className="text-center bg-black-800 text-white py-2 text-sm font-semibold">
        SFSU Software Engineering Project CSC 648-848, Spring 2025. For Demonstration Only
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto mt-2">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="SFSU Logo" className="h-12 w-12 object-contain" />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/products" className="hover:text-yellow-400">Products</Link>
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
          </nav>
        </div>

        {/* Search Bar*/}
        <div className="flex flex-grow max-w-3xl mx-6 bg-white rounded-lg overflow-hidden border border-gray-300">
          <span ref={spanRef} className="absolute invisible whitespace-nowrap px-2">
            {category}
          </span>
          <select
            ref={selectRef}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-200 text-gray-700 text-sm px-3 py-2 border-r border-gray-300 focus:outline-none transition-all"
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Fashion</option>
            <option>Home & Kitchen</option>
            <option>Computers & Accessories</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 text-black focus:outline-none"
          />

          {/* Search Button */}
          <button className="bg-green-500 px-5 py-2 hover:bg-yellow-600">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Icons Cart Button */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>

          {/* Login Button */}
          <Link to="/login" className="hover:text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

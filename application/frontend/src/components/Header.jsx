import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-900 text-white py-3 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ease-in-out">
      {/* Required Text */}
      <div className="text-center bg-black-600 text-white py-2 text-sm font-semibold">
        SFSU Software Engineering Project CSC 648-848, Spring 2025. For Demonstration Only
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto mt-2">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="SFSU Logo" className="h-12 w-12 object-contain" />
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <Link to="/products" className="hover:text-primary-500">Products</Link>
            <Link to="/about" className="hover:text-primary-500">About</Link>
            <Link to="/contact" className="hover:text-primary-500">Contact</Link>
          </nav>
        </div>

        {/* Icons and Search Box */}
        <div className="flex items-center space-x-4 relative">
          {/* Search Box Wrapper */}
          <div className="relative group">
            <button className="hover:text-primary-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search"
              className="absolute right-8 top-1/2 -translate-y-1/2 w-56 px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            />
          </div>

          <button className="hover:text-primary-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>

          <Link to="/login" className="hover:text-primary-500">
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

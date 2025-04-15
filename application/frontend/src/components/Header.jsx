import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header() {
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
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
            <Link to="/message" className="hover:text-yellow-400">Message</Link>
          </nav>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Icons and Cart */}
        <div className="flex items-center space-x-4">
          <Link to="/posting" className="hover:text-yellow-400" title="Post Listing">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>

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

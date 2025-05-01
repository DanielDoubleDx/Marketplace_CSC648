import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function handleLogout() {

}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Triggered when hovering or clicking hamburger
  const handleHamburgerMouseEnter = () => {
    if (!clicked) {
      setIsMenuOpen(true);
    }
  };

  const handleHamburgerMouseLeave = () => {
    if (!clicked) {
      setIsMenuOpen(false);
    }
  };

  const handleHamburgerClick = () => {
    setIsMenuOpen(true);
    setClicked(true);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
    setClicked(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setClicked(false);
  };

  return (
    <header className="bg-gray-900 text-white py-3 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Banner */}
      <div className="text-center bg-gray-900 text-white py-2 text-sm font-semibold">
        SFSU Software Engineering Project CSC 648-848, Spring 2025. For Demonstration Only
      </div>

      {/* Left section */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-2 relative">
        {/* Logo */}
        <div className="flex items-center space-x-4 ml-24">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="SFSU Logo"
              className="h-12 w-12 object-contain"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Right section */}
        <div className="flex items-center space-x-4 mr-24">
          {/* Post Item */}
          <Link to="/posting" className="hover:text-yellow-400" title="Post Item">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Login */}
          <Link to="/login" className="hover:text-yellow-400" title="Login">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Hamburger button */}
          <div className="relative">
            <button
              onMouseEnter={handleHamburgerMouseEnter}
              onMouseLeave={handleHamburgerMouseLeave}
              onClick={handleHamburgerClick}
              className="text-white text-2xl px-2 py-1 border border-gray-700 rounded hover:bg-gray-800"
              aria-label="Open menu"
            >
              ≡
            </button>

            {isMenuOpen && (
              <div
                className="absolute left-0 top-full mt-2 bg-gray-800 rounded shadow-lg z-50 p-4 w-32 space-y-3"
                onMouseLeave={handleMenuMouseLeave}
              >
                {/* Message */}
                <Link
                  to="/message"
                  className="block hover:text-yellow-400"
                  onClick={closeMenu}
                >
                  ✉️ Message
                </Link>

                {/* About */}
                <Link
                  to="/about"
                  className="block hover:text-yellow-400"
                  onClick={closeMenu}
                >
                  ℹ️ About
                </Link>
                <button
                    onClick={() => {
                      closeMenu();
                      handleLogout(); // NEED LOGIC
                    }}
                    className="block hover:text-yellow-400"
                >
                  🏃‍♂️ Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

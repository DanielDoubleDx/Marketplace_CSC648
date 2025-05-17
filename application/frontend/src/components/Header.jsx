import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Check login status and retrieve user information
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setIsLoggedIn(true);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check login status when component mounts
    checkLoginStatus();

    // Listen for login event
    const handleLogin = (event) => {
      console.log('Login event received:', event.detail);
      setIsLoggedIn(true);
      setUserData(event.detail.user);
    };

    // Listen for logout event
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUserData(null);
    };

    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);

    return () => {
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  // Handle user logout
  async function handleLogout() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Call logout API from backend
      const response = await fetch('http://13.52.231.140:3001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn('Logout API call failed:', response.status);
      }

      // Clear user information from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch logout event
      window.dispatchEvent(new Event('userLogout'));
      
      // Show logout success in console
      console.log('Logout successful!');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);

      // Still clear data and redirect even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLogout'));
      console.log('Logout successful!');
      navigate('/');
    }
  }

  // Triggered when hovering or clicking hamburger button
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
      {/* Top banner */}
      <div className="text-center bg-gray-900 text-white py-2 text-sm font-semibold">
        SFSU Software Engineering Project CSC 648-848, Spring 2025. For Demonstration Only
      </div>

      {/* Header main container */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-2 relative">
        {/* Logo section */}
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

        {/* Right-side section */}
        <div className="flex items-center space-x-4 mr-24">
          {/* Post Item button */}
          <Link to="/posting" className="hover:text-yellow-400" title="Post Item">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Account menu */}
          <div className="relative">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="hover:text-yellow-400 flex items-center space-x-2"
                  title="Account"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userData && (
                    <span className="text-sm">{userData.username}</span>
                  )}
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded shadow-lg z-50">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg">{userData?.username?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{userData?.full_name}</p>
                          <p className="text-sm text-gray-400">{userData?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown menu items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        👤 Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        🏃‍♂️ Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link 
                to="/login" 
                className="hover:text-yellow-400 flex items-center space-x-2"
                title="Login"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          {/* Hamburger menu button */}
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
                {/* Message page link */}
                <Link
                  to="/message"
                  className="block hover:text-yellow-400"
                  onClick={closeMenu}
                >
                  ✉️ Message
                </Link>

                {/* About page link */}
                <Link
                  to="/about"
                  className="block hover:text-yellow-400"
                  onClick={closeMenu}
                >
                  ℹ️ About
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

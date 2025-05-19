import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header() {
  // State variables for menu toggles and user info
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [accountClicked, setAccountClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Check login status on page load
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

    // Listen for login event to update login status
    const handleLogin = (event) => {
      console.log('Login event received:', event.detail);
      setIsLoggedIn(true);
      setUserData(event.detail.user);
    };

    // Listen for logout event to update login status
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

  // Logout function
  async function handleLogout() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      await fetch('http://13.52.231.140:3001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

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
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLogout'));
      console.log('Logout successful!');
      navigate('/');
    }
  }

  // Hamburger menu hover and click
  const handleHamburgerMouseEnter = () => {
    if (!clicked) setIsMenuOpen(true);
  };
  const handleHamburgerMouseLeave = () => {
    if (!clicked) setIsMenuOpen(false);
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

  // Account menu hover and click
  const handleAccountMouseEnter = () => {
    if (!accountClicked) setIsAccountMenuOpen(true);
  };
  const handleAccountMouseLeave = () => {
    if (!accountClicked) setIsAccountMenuOpen(false);
  };
  const handleAccountClick = () => {
    setIsAccountMenuOpen(true);
    setAccountClicked(true);
  };
  const handleAccountMenuMouseLeave = () => {
    setIsAccountMenuOpen(false);
    setAccountClicked(false);
  };

  return (
    <header className="bg-gray-900 text-white py-3 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Top Banner */}
      <div className="text-center bg-gray-900 text-white py-2 text-sm font-semibold">
        SFSU Software Engineering Project CSC 648-848, Spring 2025. For Demonstration Only
      </div>

      {/* Main Header Content */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mt-2 relative">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 ml-24">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="SFSU Logo" className="h-12 w-12 object-contain" />
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Right-side Icons */}
        <div className="flex items-center space-x-4 mr-24">
          {/* Posting Button */}
          <Link to="/posting" className="hover:text-yellow-400" title="Post Item">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Account Button */}
          <div className="relative">
            {isLoggedIn ? (
              <div onMouseEnter={handleAccountMouseEnter} onMouseLeave={handleAccountMouseLeave}>
                <button
                  onClick={handleAccountClick}
                  className="hover:text-yellow-400 flex items-center space-x-2"
                  title="Account"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userData && <span className="text-sm">{userData.username}</span>}
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-gray-800 rounded shadow-lg z-50"
                    onMouseLeave={handleAccountMenuMouseLeave}
                  >
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
              </div>
            ) : (
              <Link to="/login" className="hover:text-yellow-400 flex items-center space-x-2" title="Login">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>

          {/* Hamburger Button */}
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
                <Link to="/message" className="block hover:text-yellow-400" onClick={closeMenu}>
                  ✉️ Message
                </Link>
                <Link to="/about" className="block hover:text-yellow-400" onClick={closeMenu}>
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

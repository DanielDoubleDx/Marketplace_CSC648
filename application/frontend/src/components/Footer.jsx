import React from 'react';

// Footer component
function Footer() {
  // Function to smoothly scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-6 px-6 text-center mt-auto">
      <button
        onClick={scrollToTop}
        className="block mx-auto mb-4 text-sm text-green-500 hover:underline focus:outline-none"
      >
        Back to top
      </button>
      <p>&copy; 2025, gatormarket.com, CSC 648-848 Team 04</p>
    </footer>
  );
}

export default Footer;

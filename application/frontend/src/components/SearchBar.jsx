import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");
  const spanRef = useRef(null);
  const selectRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [apiListings, setApiListings] = useState([]);

  // Adjust dropdown width to match selected text
  useEffect(() => {
    if (spanRef.current && selectRef.current) {
      const textWidth = spanRef.current.offsetWidth;
      selectRef.current.style.width = `${textWidth + 30}px`;
    }
  }, [category]);

  // Clear search when leaving home page
  useEffect(() => {
    if (location.pathname !== "/") {
      clearSearch();
    }
  }, [location]);

  // Clear search results and reset inputs
  const clearSearch = () => {
    localStorage.removeItem("searchResults");
    setSearchTerm("");
    setCategory("All");
  };

  // Fetch all listings and extract unique categories
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://13.52.231.140:3001/api/search");
        const data = await response.json();
        const items = data.items || [];
        setApiListings(items);

        const apiCategories = [
          ...new Set(items.map((item) => item.category_name)),
        ];
        setCategories(["All", ...apiCategories]);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Run search and store results
  const handleSearch = () => {
    const searchTermLower = searchTerm.toLowerCase();

    const filteredProducts = apiListings.filter((product) => {
      const matchesCategory =
        category === "All" || product.category_name === category;
      const matchesName = product.title.toLowerCase().includes(searchTermLower);
      return matchesCategory && matchesName;
    });

    localStorage.setItem("searchResults", JSON.stringify(filteredProducts));
    navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
    window.dispatchEvent(
      new CustomEvent("searchCompleted", {
        detail: { results: filteredProducts },
      })
    );
  };

  // Trigger search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // Search bar container
    <div className="flex flex-grow max-w-3xl mx-6 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 search-bar-container">
      <span ref={spanRef} className="absolute invisible whitespace-nowrap px-2">
        {category}
      </span>

      {/* Category select dropdown */}
      <select
        ref={selectRef}
        value={category}
        onChange={(e) => {
          const selectedCategory = e.target.value;
          setCategory(selectedCategory);

          const searchTermLower = searchTerm.toLowerCase();
          const filtered = apiListings.filter((product) => {
            const matchesCategory =
              selectedCategory === "All" ||
              product.category_name === selectedCategory;
            const matchesName = product.title
              .toLowerCase()
              .includes(searchTermLower);
            return matchesCategory && matchesName;
          });

          // Save filtered results
          localStorage.setItem("searchResults", JSON.stringify(filtered));
          // Navigate to updated URL
          navigate(`/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);
          // Fire event to notify search completion
          window.dispatchEvent(
            new CustomEvent("searchCompleted", {
              detail: { results: filtered },
            })
          );
        }}
        className="bg-gray-700 text-white text-sm px-3 py-2 border-r border-gray-600 focus:outline-none transition-all"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat} className="bg-gray-800">
            {cat}
          </option>
        ))}
      </select>

      {/* Search input field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          const alphanumericCount = (value.match(/[a-zA-Z0-9]/g) || []).length;

          // Limit input to 40 alphanumeric characters
          if (alphanumericCount <= 40 || value.length < searchTerm.length) {
            setSearchTerm(value);
          }
        }}
        onKeyPress={handleKeyPress}
        placeholder="Search"
        className="w-full px-4 py-2 bg-gray-700 text-white focus:outline-none placeholder-gray-400"
      />

      {/* Clear button to reset search */}
      {searchTerm && (
        <button
          className="bg-gray-600 px-3 hover:bg-gray-500 clear-button"
          onClick={clearSearch}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Search button */}
      <button
        className="bg-green-500 px-5 py-2 hover:bg-green-600 search-button"
        onClick={handleSearch}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}

export default SearchBar;

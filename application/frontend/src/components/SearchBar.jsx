import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import listings from '../data/listings.json';

function SearchBar() {
    const [category, setCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const spanRef = useRef(null);
    const selectRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (spanRef.current && selectRef.current) {
            const textWidth = spanRef.current.offsetWidth;
            selectRef.current.style.width = `${textWidth + 30}px`;
        }
    }, [category]);

    // Clear search results when navigating to a different page (except the Products page)
    useEffect(() => {
        if (!location.pathname.includes('/products')) {
            clearSearch();
        }
    }, [location]);

    // Function to clear search results
    const clearSearch = () => {
        localStorage.removeItem('searchResults');
        setSearchTerm('');
        setCategory('All');
    };

    // Handle search and navigation
    const handleSearch = () => {
        const searchTermLower = searchTerm.toLowerCase();
        const filteredProducts = listings.filter(product => {
            const matchesCategory = category === "All" || product.category === category;

            // Search by full name
            const matchesFullName = product.title.toLowerCase().includes(searchTermLower);

            // Search by initials
            const productWords = product.title.split(' ');
            const matchesInitials = productWords.some(word =>
                word.toLowerCase().startsWith(searchTermLower)
            );

            // Search by each word in the product name
            const searchWords = searchTermLower.split(' ');
            const matchesWords = searchWords.every(searchWord =>
                productWords.some(productWord =>
                    productWord.toLowerCase().includes(searchWord)
                )
            );

            return matchesCategory && (matchesFullName || matchesInitials || matchesWords);
        });

        // Save search results to localStorage
        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));

        // Navigate to the Products page with query parameters
        navigate(`/products?search=${searchTerm}&category=${category}`);
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
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

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="w-full px-4 py-2 text-black focus:outline-none"
            />

            {searchTerm && (
                <button
                    className="bg-gray-200 px-3 hover:bg-gray-300"
                    onClick={clearSearch}
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <button
                className="bg-green-500 px-5 py-2 hover:bg-yellow-600"
                onClick={handleSearch}
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );
}

export default SearchBar;

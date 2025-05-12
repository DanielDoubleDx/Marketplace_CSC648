import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

// Skeleton loader component
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 text-white animate-pulse">
      <div className="bg-gray-800 p-6 rounded-lg mb-4">
        <div className="h-8 bg-gray-700 rounded-md w-3/4 mb-4"></div>
        <div className="h-[300px] bg-gray-700 rounded-md w-full mb-4"></div>
        <div className="h-6 bg-gray-700 rounded-md w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded-md w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded-md w-2/3"></div>
      </div>
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE = "http://13.52.231.140:3001";
  //const API_BASE = "http://localhost:3001";

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchProduct = async () => {
      try {
        // Fetch the product list from API
        const response = await fetch("http://13.52.231.140:3001/api/search");
        const data = await response.json();
        const foundProduct = data.items.find((p) => String(p.listing_id) === id);
        setProduct(foundProduct);
      } catch (err) {
        setError("Failed to fetch product."); // Set error message if fetch fails
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Show loading skeleton while fetching
  if (loading) return <ProductDetailSkeleton />;

  // Debug if fetch failed or product not found
  if (error || !product)
    return (
      <p className="text-center text-red-500 font-semibold py-6">
        {error || "Product not found"}
      </p>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 sm:p-8 mb-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Product title */}
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Product image */}
            <img
              src={`${API_BASE}${product.thumbnail}`}
              alt={product.title}
              className="w-full h-[300px] object-cover mb-4 border rounded-lg"
            />

            {/* Seller name and rating */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Seller Rating</h3>
              <p className="text-gray-300">{product.seller?.name || "Unknown"}</p>
              {/* Star rating display */}
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={
                      i <= (product.seller?.rating ?? 0)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-start">
            {/* Product price */}
            <h2 className="text-xl font-semibold mb-2">Price: ${product.price}</h2>

            {/* Product description */}
            <h3 className="text-lg font-medium mb-1">Description:</h3>
            <p className="mb-6 text-gray-300">
              {product.product_desc || "No description available."}
            </p>

            {/* Link to seller contact page */}
            <Link
              to={`/seller`}
              className="w-full md:w-1/2 text-white px-4 py-2 rounded text-center bg-green-500 hover:bg-green-600"
            >
              Contact Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

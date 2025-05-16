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
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://13.52.231.140:3001";
  // const API_BASE = "http://localhost:3001";

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/search`);
      const data = await response.json();
      const foundProduct = data.items.find((p) => String(p.listing_id) === id);
      setProduct(foundProduct);

      if (foundProduct && foundProduct.seller_id) {
        fetchSeller(foundProduct.seller_id);
      }
    } catch (err) {
      setError("Failed to fetch product.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeller = async (sellerId) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/${sellerId}`);
      const data = await response.json();
      if (data.seller) {
        setSeller(data.seller);
      }
    } catch (err) {
      console.error("Failed to fetch seller info:", err);
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
        {/* Product title */}
        <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Product image */}
            <img
              src={`${API_BASE}${product.thumbnail}`}
              alt={product.title}
              className="w-full h-[300px] object-cover mb-4 border rounded-lg"
            />

            {/* Seller info */}
            <div className="mt-4 grid grid-cols-[100px_1fr] gap-4 items-center">
              {/* Avatar */}
              <Link to={`/seller/${seller?.uuid || 5}`}>
                <img
                  src="/images/avatar.png"
                  alt="Seller Avatar"
                  className="w-[100px] h-[100px] object-cover rounded-full border hover:opacity-80 transition"
                />
              </Link>

              {/* Seller details */}
              <div>
                <h3 className="text-lg font-semibold">Seller</h3>
                <p className="text-gray-300">{seller?.full_name || "Unknown"}</p>
                <div className="flex mt-1 space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={
                        i <= parseFloat(seller?.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-gray-400 ml-1">
                    ({parseFloat(seller?.rating || 0)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-start">
            {/* Product price */}
            <h2 className="text-xl font-semibold mb-2">Price: ${product.price}</h2>

            <h3 className="text-lg font-medium mb-1">Category:</h3>
            <p className="text-gray-300 mb-4">{product.category_name || "Uncategorized"}</p>

            <h3 className="text-lg font-medium mb-1">Description:</h3>
            <p className="text-gray-300 mb-6">
              {product.product_desc || "No description available."}
            </p>

            {/* Contact seller button */}
            <Link
              to="/message"
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

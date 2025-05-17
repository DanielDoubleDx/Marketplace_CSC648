import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // <-- Added Link here

function SellerDetail() {
  const { username } = useParams();
  const { sellerId } = useParams(); // sellerId = uuid from URL
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeller() {
      try {
        const response = await fetch(`http://13.52.231.140:3001/api/user/${sellerId}`);
        const data = await response.json();

        if (data.seller) {
          setSeller(data.seller); // seller info like full_name, about_me, rating
          setProducts(data.products || []); // seller's products
        }
      } catch (error) {
        console.error('Failed to fetch seller data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSeller();
  }, [sellerId]);

  useEffect(() => {
    async function fetchSellerByUsername() {
      try {
        const response = await fetch(`http://13.52.231.140:3001/api/user/username/${username}`);
        const data = await response.json();

        if (data.seller) {
          setSeller(data.seller);
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch seller data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSellerByUsername();
  }, [username]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!seller) return <div className="text-red-500">Seller not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <section className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Avatar */}
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <img
              src="/images/avatar.png"
              alt="Default Seller Avatar"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          {/* Seller Info */}
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Name</h3>
              <p>{seller.full_name}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">About Me</h3>
              <p>{seller.about_me || 'No bio available.'}</p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => {
                const fillLevel = Math.min(Math.max(parseFloat(seller.rating) - (i - 1), 0), 1) * 100;
                return (
                  <div key={i} className="relative w-6 h-6">
                    <svg
                      className="absolute top-0 left-0 w-full h-full text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z" />
                    </svg>
                    <svg
                      className="absolute top-0 left-0 w-full h-full"
                      fill="url(#starGradient)"
                      viewBox="0 0 20 20"
                      style={{
                        maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z\' /%3E%3C/svg%3E")',
                        WebkitMaskImage:
                          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z\' /%3E%3C/svg%3E")',
                        background: `linear-gradient(to right, #facc15 ${fillLevel}%, #4b5563 ${fillLevel}%)`
                      }}
                    />
                  </div>
                );
              })}
              <span className="text-gray-400 ml-2">({seller.rating})</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {seller.username ? `${seller.username}'s Products` : "Seller's Products"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Link
                to={`/product/${product.listing_id}`}
                key={product.listing_id}
                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={`http://13.52.231.140:3001${product.listing_img}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="font-semibold text-white">{product.title}</p>
                  <p className="text-gray-400 text-sm">${product.price}</p>
                  <p className="text-gray-500 text-xs">{product.category_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SellerDetail;

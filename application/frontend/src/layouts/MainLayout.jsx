import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />

      <main className="flex-grow mt-24 px-6 py-8">
        <Outlet />
      </main>

      {/* Contact Button */}
      <button
        onClick={handleContactClick}
        className="fixed bottom-10 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg"
        title="Contact Us"
      >
        💬
      </button>

      <Footer />
    </div>
  );
}

export default MainLayout;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import ProductDetail from './pages/ProductDetail';
import Messaging from './pages/Message';
import Posting from './pages/Posting';
import SellerDetail from './pages/SellerDetail';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "message/:sellerId", element: <Messaging /> },
      { path: "posting", element: <Posting /> },
      { path: "seller/:sellerId", element: <SellerDetail /> },
      { path: "profile", element: <Profile /> },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider 
      router={router} 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }} 
    />
  </React.StrictMode>
);

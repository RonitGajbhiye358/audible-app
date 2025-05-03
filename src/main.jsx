import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/Store';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute, PublicRoute, AdminRoute } from './component/Routes';

// Public Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/Register';

// User Pages
import Home from './pages/home/Home';
import AudiobookPage from './pages/Audiobooks/AudiobookPage';
import CartPage from './pages/cart/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageBooks from './pages/Admin/ManageBooks';
import ManageOrders from './pages/Admin/ManageOrders';

// Components
import LogoutButton from './component/LogoutButton';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes (no header)
      { 
        path: "/login", 
        element: <PublicRoute><LoginPage /></PublicRoute> 
      },
      { 
        path: "/register", 
        element: <PublicRoute><RegisterPage /></PublicRoute> 
      },
      
      // Protected routes (with header)
      {
        children: [
          { index: true, element: <Home /> },
          { path: "/audiobooks", element: <PrivateRoute><AudiobookPage /></PrivateRoute> },
          { path: "/cart", element: <PrivateRoute><CartPage /></PrivateRoute> },
          { path: "/payment", element: <PrivateRoute><PaymentPage /></PrivateRoute> },
          { path: "/order-confirmation", element: <PrivateRoute><OrderConfirmation /></PrivateRoute> },
          { path: "/logout", element: <LogoutButton /> },
        ]
      },
      
      // Admin routes (with admin header)
      {
        path: "/admin",
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          { index: true, element: <Navigate to="/admin/users" replace /> },
          { path: "users", element: <ManageUsers /> },
          { path: "books", element: <ManageBooks /> },
          { path: "orders", element: <ManageOrders /> },
        ],
      },
      
      // Fallback route
      { path: "*", element: <Navigate to="/" /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
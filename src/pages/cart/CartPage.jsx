import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import api from '../../api/api';
import { selectCurrentUser } from '../../app/authSlice';
import EmptyCartIllustration from '../../component/EmptyCartIllustration';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const userId = user?.customerId;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        const response = await api.get(`/user/cart/get/${userId}`);
        setCartItems(response.data || []);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If backend returns 404, treat it as an empty cart
          setCartItems([]);
          setError(null);
        } else {
          setError('Failed to fetch cart items');
          console.error('Error fetching cart:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCartItems();
  }, [userId]);

  const handleRemoveItem = async (audiobookId) => {
    try {
      const response = await api.delete(`/user/cart/remove/${userId}/${audiobookId}`);
      
      if (response.status === 200) {
        const updatedCart = await api.get(`/user/cart/get/${userId}`);
        setCartItems(updatedCart.data);
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from cart');
      // Refresh cart to ensure UI matches server state
      const updatedCart = await api.get(`/user/cart/get/${userId}`);
      setCartItems(updatedCart.data);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await api.delete(`/user/cart/clear/${userId}`);
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your cart is waiting</h2>
          <p className="text-gray-600 mb-6">Sign in to view your saved items</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-center pt-24 pb-12">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-center pt-24 pb-20">
        <EmptyCartIllustration className="w-48 h-48 mx-auto mb-6 text-gray-300" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Discover amazing audiobooks to add to your collection</p>
        <button
          onClick={() => navigate('/audiobooks')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Audiobooks
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <span className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        <div className="space-y-4 mb-8">
          {cartItems.map(item => (
            <div key={item.bookId} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.author || 'Unknown Author'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">${item.price?.toFixed(2) || '0.00'}</span>
                <button
                  onClick={() => handleRemoveItem(item.bookId)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <span className="text-xl font-bold">${calculateTotal()}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleClearCart}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear Cart</span>
            </button>
            <button
              onClick={() => navigate('/payment', { state: { cartItems } })}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Proceed to Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
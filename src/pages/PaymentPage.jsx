import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectCurrentUser } from '../app/authSlice';
import api from '../api/api';

const PaymentPage = () => {
  const [paymentMode, setPaymentMode] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const userId = user?.customerId;

  // If coming from cart page with state
  useEffect(() => {
    if (location.state?.cartItems) {
      setOrderDetails({
        items: location.state.cartItems,
        total: location.state.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
      });
    }
  }, [location.state]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please login to complete payment');
      return;
    }

    if (!orderDetails?.items || orderDetails.items.length === 0) {
      setError('No items to purchase');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Call order service to place order and process payment
      const response = await api.post(`/orders/place/${userId}/${paymentMode}`);
      
      if (response.status === 200) {
        // Payment successful
        navigate('/order-confirmation', { 
          state: { 
            message: response.data,
            orderId: response.data.orderId // Assuming response contains order ID
          }
        });
      } else {
        setError(response.data || 'Payment processing failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment service unavailable. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Please login to complete your purchase</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Loading order details...</p>
        <button 
          onClick={handleBackToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Payment Information</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="mb-4 divide-y">
          {orderDetails.items.map(item => (
            <li key={item.bookId} className="py-2">
              <div className="flex justify-between">
                <span>{item.title}</span>
                <span>${item.price?.toFixed(2) || '0.00'}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="credit"
              name="paymentMode"
              value="credit"
              checked={paymentMode === 'credit'}
              onChange={() => setPaymentMode('credit')}
              className="mr-2"
            />
            <label htmlFor="credit">Credit Card</label>
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="debit"
              name="paymentMode"
              value="debit"
              checked={paymentMode === 'debit'}
              onChange={() => setPaymentMode('debit')}
              className="mr-2"
            />
            <label htmlFor="debit">Debit Card</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="paypal"
              name="paymentMode"
              value="paypal"
              checked={paymentMode === 'paypal'}
              onChange={() => setPaymentMode('paypal')}
              className="mr-2"
            />
            <label htmlFor="paypal">PayPal</label>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={handleBackToCart}
            disabled={isProcessing}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1 disabled:bg-green-400"
          >
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
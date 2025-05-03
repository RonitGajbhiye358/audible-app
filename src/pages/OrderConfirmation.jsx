import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, orderId } = location.state || {};

  if (!message) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <svg 
          className="w-16 h-16 text-green-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="mb-4">{message}</p>
        {orderId && (
          <p className="mb-6">
            Order ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span>
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
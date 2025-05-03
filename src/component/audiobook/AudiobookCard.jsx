import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useSelector } from "react-redux";
import { selectCurrentUser } from '../../app/authSlice';

const AudiobookCard = ({ book }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const user = useSelector(selectCurrentUser);
  const userId = user?.customerId;

  const bookId = Number(book.bookId);

  useEffect(() => {
    const checkBookStatus = async () => {
      if (!userId) return;
      
      try {
        const response = await api.get(`/orders/purchased-books/${userId}`);
        const purchasedBookIds = response.data.map(id => Number(id));
        setIsPurchased(purchasedBookIds.includes(bookId));

        try {
          const cartResponse = await api.get(`/user/cart/get/${userId}`);
          const cartItems = cartResponse.data || [];
          setIsInCart(cartItems.some(item => Number(item.bookId) === bookId));
        } catch (err) {
          if (err.response?.status === 404) {
            setIsInCart(false);
          }
        }
      } catch (error) {
        console.error('Error checking book status:', error);
      }
    };
  
    checkBookStatus();
  }, [userId, bookId]);

  const handleButtonClick = () => {
    if (isPurchased) {
      navigate(`/audiobook/${bookId}/listen`);
    } else if (isInCart) {
      navigate('/cart');
    } else if (userId) {
      addToCart();
    } else {
      navigate('/login');
    }
  };

  const addToCart = async () => {
    try {
      setIsLoading(true);
      await api.post(`/user/cart/add/${userId}`, [bookId]);
      setIsInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonVariant = () => {
    if (isPurchased) return {
      text: 'Listen Now',
      class: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      icon: '🎧'
    };
    if (isInCart) return {
      text: 'View Cart',
      class: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      icon: '🛒'
    };
    return {
      text: 'Add to Cart',
      class: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      icon: '➕'
    };
  };

  const buttonVariant = getButtonVariant();

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 ${
        isHovered ? 'scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Cover Placeholder */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <span className="text-4xl">📚</span>
      </div>

      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {isPurchased && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">✓</span> Owned
          </span>
        )}
        {isInCart && !isPurchased && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            In Cart
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          by {book.author || 'Unknown Author'}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-3">⏱️ {formatDuration(book.time)}</span>
          <span>🎧 {book.narrator || 'Unknown Narrator'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-xl font-bold ${
              isPurchased ? 'text-gray-400 line-through' : 'text-indigo-600'
            }`}>
              ${book.price?.toFixed(2) || '0.00'}
            </span>
          </div>

          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`bg-gradient-to-r ${buttonVariant.class} text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-all transform ${
              isHovered ? 'scale-105' : 'scale-100'
            } disabled:opacity-70`}
          >
            <span className="mr-2">{buttonVariant.icon}</span>
            {isLoading ? 'Processing...' : buttonVariant.text}
          </button>
        </div>
      </div>
    </div>
  );
};

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
};

export default AudiobookCard;
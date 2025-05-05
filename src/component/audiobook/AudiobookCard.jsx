import React, { useState, useEffect, useCallback } from 'react';
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

  // Memoized status check
  const checkBookStatus = useCallback(async () => {
    if (!userId) return;
    
    try {
      const [purchasedRes, cartRes] = await Promise.all([
        api.get(`/orders/purchased-books/${userId}`),
        api.get(`/user/cart/get/${userId}`).catch(err => 
          err.response?.status === 404 ? { data: [] } : Promise.reject(err)
        )
      ]);

      setIsPurchased(purchasedRes.data.map(Number).includes(bookId));
      setIsInCart(cartRes.data.some(item => Number(item.bookId) === bookId));
    } catch (error) {
      console.error('Error checking book status:', error);
    }
  }, [userId, bookId]);

  useEffect(() => {
    checkBookStatus();
  }, [checkBookStatus]);

  const handleButtonClick = () => {
    if (isPurchased) {
      handleDownload();
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

  const handleDownload = async () => {
    if (!isPurchased) return;
    
    try {
      setIsLoading(true);
      
      // Use streaming approach with axios
      const response = await api.get(`/user/audiobook/audio/${bookId}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          // Optional: Add progress tracking if needed
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`Download progress: ${percentCompleted}%`);
        }
      });

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from headers or use default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `audiobook_${bookId}.mp3`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      if (error.response?.status === 403) {
        alert('You need to purchase this audiobook before downloading');
      } else if (error.response?.status === 404) {
        alert('Audio file not found');
      } else {
        alert('Download failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonVariant = () => {
    if (isPurchased) return {
      text: 'Download Now',
      class: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      icon: '⬇️',
      action: handleDownload
    };
    if (isInCart) return {
      text: 'View Cart',
      class: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      icon: '🛒',
      action: () => navigate('/cart')
    };
    return {
      text: 'Add to Cart',
      class: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      icon: '➕',
      action: userId ? addToCart : () => navigate('/login')
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
            onClick={buttonVariant.action}
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
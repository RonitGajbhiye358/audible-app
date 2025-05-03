import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudiobookCard from '../../component/audiobook/AudiobookCard';
import api from '../../api/api'; // Axios instance with interceptor
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../app/authSlice';

const AudiobookPage = () => {
  // State variables for handling audiobook data, UI state, and search
  const [audiobooks, setAudiobooks] = useState([]);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  // Get the current user from Redux store
  const user = useSelector(selectCurrentUser);
  const userId = user?.customerId;

  // Fetch all audiobooks on mount; redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAudiobooks = async () => {
      try {
        const response = await api.get('/user/all-audiobooks');
        const data = response.data;
        setAudiobooks(data);
        setFilteredAudiobooks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch audiobooks');
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, [navigate]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredAudiobooks(audiobooks);
      setSearching(false);
      return;
    }
    setSearching(true);
    const filtered = audiobooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAudiobooks(filtered);
  };

  // Display loading spinner while fetching data
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );

  // Display error message if data fetching fails
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-white px-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h2 className="font-semibold text-xl mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col ">
      
      {/* Hero Section with Search Bar */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden text-white pb-10 pt-32 shadow-md">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold mb-3">Discover Your Next Favorite Story</h1>
          <p className="text-lg mb-8">Thousands of audiobooks at your fingertips</p>
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for audiobooks by title..."
              className="w-full py-3 px-5 rounded-full text-gray-800 shadow-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search audiobooks"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-full shadow-md transition-colors"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Main Content - Audiobook Grid */}
      <div className="container mx-auto py-12 px-4 flex-1">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {searching ? `Search Results for "${searchTerm}"` : 'Featured Audiobooks'}
          </h2>
          {searching && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredAudiobooks(audiobooks);
                setSearching(false);
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center transition"
              aria-label="Clear Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to all audiobooks
            </button>
          )}
        </div>

        {/* Audiobook Cards or No Results Message */}
        {filteredAudiobooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searching ? `No audiobooks found matching "${searchTerm}"` : 'No audiobooks available'}
            </p>
            {searching && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredAudiobooks(audiobooks);
                  setSearching(false);
                }}
                className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {filteredAudiobooks.map(book => (
              <AudiobookCard key={book.bookId} book={book} userId={userId} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AudiobookPage;

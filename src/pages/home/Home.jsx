import React from 'react';
import { FiPlay, FiHeadphones, FiBookOpen, FiSearch, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate()
  const featuredBooks = [
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      image: 'https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=400&q=80',
      duration: '6h 45m',
      rating: 4.8
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b82b5f9?auto=format&fit=crop&w=400&q=80',
      duration: '5h 35m',
      rating: 4.9
    },
    {
      title: 'Becoming',
      author: 'Michelle Obama',
      image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80',
      duration: '19h 3m',
      rating: 4.7
    },
  ];

  const categories = [
    { name: 'Bestsellers', icon: <FiStar className="text-2xl" /> },
    { name: 'New Releases', icon: <FiBookOpen className="text-2xl" /> },
    { name: 'Self-Development', icon: <FiHeadphones className="text-2xl" /> },
    { name: 'Fiction', icon: <FiPlay className="text-2xl" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">      
      {/* Hero Section */}
      <section className="relative text-center pt-36 bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Immerse Yourself in <span className="text-yellow-300">Stories</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover the world's best audiobooks with crystal-clear narration and captivating performances.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                onClick={() => navigate('/audiobooks')}
                key={index} 
                className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center hover:bg-indigo-50 hover:shadow-md transition cursor-pointer group"
              >
                <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Featured Audiobooks</h2>
            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </button>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBooks.map((book, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-lg">
                    <FiPlay className="text-lg" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-400 mr-2">
                      <FiStar className="fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">{book.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">• {book.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{book.title}</h3>
                  <p className="text-gray-600 mb-4">{book.author}</p>
                  <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition">
                    Add to Library
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React from 'react';
import { FiPlay, FiHeadphones, FiBookOpen, FiSearch, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate()

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

      
    </div>
  );
};

export default Home;
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Audible App</h2>
          <p className="text-sm">
            Discover, purchase, and enjoy thousands of audiobooks from top authors and narrators worldwide.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/library" className="hover:text-white">Library</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/category/fiction" className="hover:text-white">Fiction</a></li>
            <li><a href="/category/motivation" className="hover:text-white">Motivation</a></li>
            <li><a href="/category/biography" className="hover:text-white">Biography</a></li>
            <li><a href="/category/technology" className="hover:text-white">Technology</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-sm mt-10 text-gray-500">
        &copy; {new Date().getFullYear()} Audible App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

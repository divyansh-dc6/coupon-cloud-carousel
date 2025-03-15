import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-300"
        >
          Go Home
        </Link>
        <Link 
          to="/admin" 
          className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition duration-300"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
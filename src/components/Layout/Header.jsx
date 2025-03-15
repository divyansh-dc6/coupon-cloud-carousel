import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navigation from './Navigation';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition duration-300">
            Coupon Distributor
          </Link>
        </div>
        
        <Navigation />
        
        <div className="flex items-center mt-3 sm:mt-0">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-sm">Welcome, Admin</span>
              <button
                onClick={logout}
                className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/admin" 
              className="bg-white text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
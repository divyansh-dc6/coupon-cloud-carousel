import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
// Navigation.jsx
import { AuthContext } from '../../context/AuthContext'; // Use named import


const Navigation = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <nav className="flex items-center">
      <ul className="flex flex-wrap space-x-1 md:space-x-6">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive 
                ? "text-white font-bold border-b-2 border-white py-1 px-2" 
                : "text-indigo-100 hover:text-white py-1 px-2 transition duration-300"
            }
          >
            Home
          </NavLink>
        </li>
        
        {currentUser && (
          <>
            <li>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-white font-bold border-b-2 border-white py-1 px-2" 
                    : "text-indigo-100 hover:text-white py-1 px-2 transition duration-300"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/coupons" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-white font-bold border-b-2 border-white py-1 px-2" 
                    : "text-indigo-100 hover:text-white py-1 px-2 transition duration-300"
                }
              >
                Manage Coupons
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/history" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-white font-bold border-b-2 border-white py-1 px-2" 
                    : "text-indigo-100 hover:text-white py-1 px-2 transition duration-300"
                }
              >
                Claim History
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;

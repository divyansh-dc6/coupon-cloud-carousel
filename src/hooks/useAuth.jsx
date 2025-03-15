import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context containing currentUser, login, logout, and error
 */
const useAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return auth;
};

export default useAuth;
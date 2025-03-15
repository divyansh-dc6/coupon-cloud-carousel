import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from '../components/Admin/AdminLogin';
import Dashboard from '../components/Admin/Dashboard';
import Loading from '../components/Common/Loading';
import useAuth from '../hooks/useAuth';

const Admin = () => {
  const { currentUser, loading } = useAuth();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  
  // Reset error when component mounts
  useEffect(() => {
    setLoginError('');
  }, []);
  
  const handleLoginSuccess = () => {
    navigate('/admin/coupons');
  };
  
  const handleLoginError = (error) => {
    setLoginError(error || 'Login failed. Please check your credentials.');
  };
  
  if (loading) {
    return <Loading message="Loading admin panel..." />;
  }
  
  // If already logged in, show the dashboard
  if (currentUser) {
    return <Dashboard />;
  }
  
  // Otherwise show login form
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-1">Access the coupon management system</p>
          </div>
          
          <AdminLogin 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            error={loginError}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
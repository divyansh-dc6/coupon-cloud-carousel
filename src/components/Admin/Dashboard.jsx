import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCoupon } from '../../context/CouponContext';
import CouponManager from './CouponManager';
import ClaimHistory from './ClaimHistory';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { loadCoupons, loadClaimHistory, loadSettings, coupons, claims, settings } = useCoupon();
  const [activeTab, setActiveTab] = useState('coupons');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    availableCoupons: 0,
    totalClaims: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          loadCoupons(),
          loadClaimHistory(),
          loadSettings()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (coupons.length > 0) {
      setStats({
        totalCoupons: coupons.length,
        availableCoupons: coupons.filter(c => c.isAvailable).length,
        totalClaims: claims.length
      });
    }
  }, [coupons, claims]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your coupon distribution system
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Coupons
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.totalCoupons}
              </dd>
            </dl>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Available Coupons
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.availableCoupons}
              </dd>
            </dl>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Claims
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.totalClaims}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'coupons'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('coupons')}
          >
            Coupon Management
          </button>
          <button
            className={`${
              activeTab === 'claims'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('claims')}
          >
            Claim History
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'coupons' && <CouponManager />}
        {activeTab === 'claims' && <ClaimHistory />}
      </div>
    </div>
  );
};

export default Dashboard;
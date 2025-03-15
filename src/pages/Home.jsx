import React, { useState } from 'react';
import CouponClaim from '../components/User/CouponClaim';
import FeedbackMessage from '../components/User/FeedbackMessage';
import { getSessionId } from '../services/trackingService';

const Home = () => {
  const [feedbackState, setFeedbackState] = useState({
    show: false,
    type: '', // 'success', 'error', 'warning'
    message: '',
    couponCode: null
  });
  
  // Ensure session ID is created on page load
  useState(() => {
    getSessionId();
  }, []);

  const handleClaimSuccess = (couponCode) => {
    setFeedbackState({
      show: true,
      type: 'success',
      message: 'You have successfully claimed a coupon!',
      couponCode
    });
  };

  const handleClaimError = (errorMessage) => {
    setFeedbackState({
      show: true,
      type: 'error',
      message: errorMessage || 'Failed to claim coupon. Please try again later.',
      couponCode: null
    });
  };

  const handleCooldown = (timeRemaining) => {
    setFeedbackState({
      show: true,
      type: 'warning',
      message: `You need to wait ${timeRemaining} before claiming another coupon.`,
      couponCode: null
    });
  };

  const clearFeedback = () => {
    setFeedbackState({
      show: false,
      type: '',
      message: '',
      couponCode: null
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Coupon Distributor
            </h1>
            <p className="text-lg text-gray-600">
              Claim your exclusive coupon code below
            </p>
          </div>

          {feedbackState.show ? (
            <FeedbackMessage
              type={feedbackState.type}
              message={feedbackState.message}
              couponCode={feedbackState.couponCode}
              onClose={clearFeedback}
              onTryAgain={clearFeedback}
            />
          ) : (
            <CouponClaim
              onSuccess={handleClaimSuccess}
              onError={handleClaimError}
              onCooldown={handleCooldown}
            />
          )}
        </div>
      </div>
      
      <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-3">1</span>
            <p className="text-gray-600">Click the "Get Coupon" button to claim a unique discount code.</p>
          </div>
          <div className="flex items-start">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-3">2</span>
            <p className="text-gray-600">Each user can claim one coupon every hour.</p>
          </div>
          <div className="flex items-start">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-3">3</span>
            <p className="text-gray-600">Use your coupon code at checkout to receive your discount.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
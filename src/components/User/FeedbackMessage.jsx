import React from 'react';

const FeedbackMessage = ({ type, title, message, coupon, onClose, showCouponCode }) => {
  return (
    <div className={`mt-6 p-4 rounded-lg border ${
      type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {type === 'success' ? (
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <h3 className={`ml-2 text-lg font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className={`mt-2 text-sm ${
        type === 'success' ? 'text-green-700' : 'text-red-700'
      }`}>
        {message}
      </p>
      
      {type === 'success' && coupon && showCouponCode && (
        <div className="mt-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Coupon</label>
            <div className="flex">
              <input
                type="text"
                value={coupon.code}
                readOnly
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  alert('Coupon code copied to clipboard!');
                }}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md border border-l-0 border-gray-300 text-gray-700 focus:outline-none"
                title="Copy to clipboard"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            {coupon.description && (
              <p className="text-sm text-gray-600 mt-1">
                {coupon.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackMessage;
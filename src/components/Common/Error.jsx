import React from 'react';

const Error = ({ message, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md mx-auto">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md w-full">
        <div className="flex items-center">
          <svg className="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">Error</p>
        </div>
        <p className="mt-2">{message || "Something went wrong. Please try again later."}</p>
      </div>
      
      {retry && (
        <button
          onClick={retry}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
import React from 'react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default Loading;
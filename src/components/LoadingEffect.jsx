import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"></div>
        <div className="relative z-10 animate-spin">
          <div className="w-48 h-48 border-8 border-transparent border-t-blue-600 border-r-blue-600 rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full shadow-lg"></div>
        </div>
      </div>
      <div className="absolute bottom-1/4 text-blue-800 font-semibold animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',     // 20px
    medium: 'w-8 h-8',    // 32px (close to original 30px)
    large: 'w-10 h-10'    // 40px
  };

  return (
    <div className="inline-block">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner-animation {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div 
        className={`
          ${sizeClasses[size]}
          border-3
          border-gray-600
          border-t-orange-400
          rounded-full
          spinner-animation
        `}
      />
    </div>
  );
};

export default LoadingSpinner;
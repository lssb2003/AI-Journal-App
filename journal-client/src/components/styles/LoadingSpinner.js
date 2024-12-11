import React from 'react';
import { COLORS } from '../styles/shared-styles';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: '20px',
    medium: '30px',
    large: '40px'
  };

  const spinnerStyle = {
    width: sizes[size],
    height: sizes[size],
    border: `3px solid ${COLORS.spinnerBg}`,
    borderTop: `3px solid ${COLORS.spinnerPrimary}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
    </div>
  );
};

export default LoadingSpinner;


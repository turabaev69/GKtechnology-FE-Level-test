import React from 'react';

interface LoadingDotProps {
  size?: 'lg' | 'sm' | 'md' | 'xsm';
}

const LoadingDot: React.FC<LoadingDotProps> = ({ size = 'md' }) => {
  return (
    <div className={`dot-loading ${size}`}>
      <span className="dot1"></span>
      <span className="dot2"></span>
      <span className="dot3"></span>
    </div>
  );
};

export default LoadingDot;

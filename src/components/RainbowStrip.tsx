import React from 'react';

export const RainbowStrip: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div 
      className={`w-full h-[6px] overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(90deg, #ff4d4d 0%, #f97316 12%, #facc15 25%, #22c55e 38%, #14b8a6 52%, #0ea5e9 65%, #6366f1 78%, #a855f7 90%, #ec4899 100%)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
      }}
    />
  );
};

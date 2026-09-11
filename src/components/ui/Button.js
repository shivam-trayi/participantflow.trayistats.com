import React from 'react';

export default function Button({ children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${disabled ? 'bg-secondary opacity-60 text-textSecondary cursor-not-allowed' : 'bg-primary text-white hover:opacity-90 active:scale-[0.98]'} ${className}`}
    >
      {children}
    </button>
  );
}

import React from 'react';

export default function OptionCard({ label, isSelected, onClick, type = "radio" }) {
  return (
    <label
      onClick={onClick}
      className={`flex items-center p-4 mb-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'bg-paper border-primary shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-paper/50 border-transparent hover:border-secondary/30'}`}
    >
      <div className={`w-5 h-5 flex items-center justify-center mr-4 border-2 ${type === 'radio' ? 'rounded-full' : 'rounded-md'} ${isSelected ? 'border-primary' : 'border-secondary'}`}>
        {isSelected && (
          <div className={`bg-primary ${type === 'radio' ? 'w-2.5 h-2.5 rounded-full' : 'w-3 h-3 rounded-sm'}`} />
        )}
      </div>
      <span className={`text-base ${isSelected ? 'text-textPrimary font-semibold' : 'text-textSecondary'}`}>
        {label}
      </span>
    </label>
  );
}

import React from 'react';
import { Check } from 'lucide-react';
import { themeClasses } from '../../theme/themeConfig';

const OptionCard = ({ option, isSelected, onClick, idx, isMulti = false }) => {
    return (
        <button
            key={`${option.OId}-${idx}`}
            type="button"
            onClick={onClick}
            
            className={`animate-option-item relative w-full min-h-[46px] sm:min-h-[52px] px-3.5 py-3 sm:px-4 sm:py-3.5 mb-2 sm:mb-2.5 rounded-2xl border text-left flex items-center gap-3 sm:gap-4 transition-all duration-200 group cursor-pointer focus:outline-none hover:-translate-y-[1px] ${
                isSelected
                    ? themeClasses.optionCard.selected
                    : themeClasses.optionCard.unselected
            }`}
        >
            <div className={`flex items-center justify-center flex-shrink-0 transition-all duration-150 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] ${
                isMulti ? 'rounded-[5px]' : 'rounded-full'
            } ${
                isSelected ? themeClasses.optionCard.checkboxSelected : themeClasses.optionCard.checkboxUnselected
            }`}>
                {isSelected && !isMulti && <div className="w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] rounded-full bg-white shadow-xs animate-check-pop" />}
                {isSelected && isMulti && <Check className="w-3 h-3 stroke-[3] animate-check-pop" />}
            </div>
            <span className="flex-1 text-left text-[14px] sm:text-[15.5px] font-semibold text-slate-800 leading-normal break-words">
                {option.optionText}
            </span>
        </button>
    );
};

export default OptionCard;

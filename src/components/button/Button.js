import CircularProgress from '@mui/material/CircularProgress';
import { themeClasses } from '../../theme/themeConfig';

const Button = ({ 
    children, 
    onClick, 
    disabled, 
    isLoading, 
    className = '',
    type = 'button',
    icon: Icon
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`relative overflow-hidden w-full h-[48px] sm:h-[54px] rounded-[12px] sm:rounded-[14px] font-bold text-[15px] sm:text-[16px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md ${
                !(disabled || isLoading)
                ? `${themeClasses.buttonGradient} text-white cursor-pointer shadow-[#6b42d3]/15 hover:shadow-[#6b42d3]/25 hover:-translate-y-[2px]` 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            } ${className}`}
        >
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                <>
                    {children}
                    {Icon && <Icon className="w-5 h-5 stroke-[2.5]" />}
                </>
            )}
        </button>
    );
};

export default Button;

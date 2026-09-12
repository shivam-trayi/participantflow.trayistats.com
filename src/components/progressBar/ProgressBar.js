import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { themeClasses } from '../../theme/themeConfig';

const ProgressBar = ({ currentQuestionIndex, totalQuestions, progressPercent, handleBack, handleNext }) => {
    return (
        <header className={`flex-shrink-0 z-30 w-full pt-3 pb-2.5 px-4 sm:px-6 ${themeClasses.progressBar.wrapper}`}>
            <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    {currentQuestionIndex > 0 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer active:scale-90 border ${themeClasses.progressBar.backButton}`}
                        >
                            <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
                        </button>
                    ) : <div className="w-9 h-9 opacity-0 pointer-events-none" />}
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <div className={`flex-1 h-2 rounded-full overflow-hidden relative ${themeClasses.progressBar.track}`}>
                        <div
                            className={`h-full ${themeClasses.progressBar.fill} rounded-full transition-all duration-300 ease-out`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className={`text-[12px] font-bold tabular-nums px-2.5 py-0.5 rounded-full border ${themeClasses.progressBar.pill}`}>
                        {progressPercent}%
                    </span>
                </div>

                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleNext}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer active:scale-90 border ${themeClasses.progressBar.nextButton}`}
                    >
                        <ChevronRight className="w-5 h-5 stroke-[2.4]" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ProgressBar;

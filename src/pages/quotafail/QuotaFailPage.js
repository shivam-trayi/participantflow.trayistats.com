import { MESSAGES } from "../../constants/messages";
import { useEffect, useState } from 'react';
import { getUrlParam } from "../../utils/urlUtils";
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import "../../styles/animations.css";
import { themeClasses } from "../../theme/themeConfig";

const QuotaFailPage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector((state) => state.alert?.message || "");
    const loading = useSelector((state) => state.spinner?.loading || false);

    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);

    let allRequestData = requestData(window);

    let c1Search = getUrlParam('rid', 'Empty');
    let c2Search = getUrlParam('pid', 'Empty');
    let c3Search = getUrlParam('memberId', 'Empty');

    useEffect(() => {
        if (alertMessage === "" && allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: MESSAGES.COMMON.BAD_URL_ERROR }));
        }
    }, [alertMessage, allRequestData.badUrlHitting, dispatch]);

    // Call the Update Participant API
    useEffect(() => {
        if (!updateParticipantFromClient && !allRequestData.badUrlHitting) {
            let allQueryParams = allRequestData.urlQueryString;
            let landingURL = allRequestData.landingURL;
            setUpdateParticipantFromClient(true);

            dispatch(startSpinner());

            dispatch(updateParticipantFromClientAction(allQueryParams, landingURL, 2))
                .then((result) => {
                    dispatch(endSpinner());
                    if (result.type === "MESSAGE") {
                        dispatch(setMessage({ success: result.success, message: result.message }));
                    } else if (result.type === "REDIRECT") {
                        window.location.href = result.redirectURL;
                    }
                })
                .catch((error) => {
                    dispatch(endSpinner());
                    dispatch(setMessage({ success: false, message: error.message || MESSAGES.COMMON.UNKNOWN_ERROR }));
                });
        }
    }, [updateParticipantFromClient, allRequestData.badUrlHitting, allRequestData.urlQueryString, allRequestData.landingURL, dispatch]);

    const isHiddenRoute = (
        c1Search.startsWith("SS") || c2Search.startsWith("SS") ||
        c1Search.startsWith("NBL") ||
        c3Search.startsWith("NBL") ||
        c2Search.startsWith("NBL")
    );

    if (isHiddenRoute) {
        return <div></div>;
    }

    // Static 100% Full State
    const CIRCUMFERENCE = 2 * Math.PI * 82; // ~515.22
    const currentPercent = 100;
    const strokeOffset = CIRCUMFERENCE - (currentPercent / 100) * CIRCUMFERENCE;
    const activeCount = 10;
    const isLocked = true; // Always show the locked/failed design

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', background: 'radial-gradient(circle at 50% 30%, #fffbf2 0%, #fefcf9 45%, #f8fafc 100%)', overflowX: 'hidden' }}>

            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">

                {/* CIRCULAR QUOTA INDICATOR */}
                <div className="relative flex items-center justify-center mb-8">

                    {/* Concentric Halo Rings */}
                    <div className="qf-hero-halo qf-halo-outer"></div>
                    <div className="qf-hero-halo qf-halo-mid"></div>
                    <div className="qf-hero-halo qf-halo-inner"></div>

                    {/* Outer 3D White Raised Disc */}
                    <div className={`relative z-10 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white/95 border border-amber-100/90 flex items-center justify-center transition-all duration-700 ${isLocked ? 'qf-pulse-glow' : ''}`}>

                        {/* SVG Dual Stroke Circular Ring */}
                        <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90" viewBox="0 0 200 200">
                            {/* Background track */}
                            <circle cx="100" cy="100" r="82" stroke="#fef3c7" strokeWidth="12" fill="none" opacity="0.6" />

                            {/* Animated Progress Stroke */}
                            <circle
                                cx="100" cy="100" r="82"
                                stroke="url(#amberGradient)"
                                strokeWidth="12.5"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeOffset}
                                className="transition-[stroke-dashoffset] duration-150 ease-out"
                            />

                            {/* Inner Dotted Accent Track */}
                            <circle cx="100" cy="100" r="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2.5 4" fill="none" opacity="0.45" />

                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="60%" stopColor="#ea580c" />
                                    <stop offset="100%" stopColor="#c2410c" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Inner Circular Core Content */}
                        <div className="absolute inset-0 m-auto w-40 h-40 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center p-3">

                            {/* Padlock Squircle Badge */}
                            <div className={`mb-1 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/35 transition-all ${isLocked ? 'qf-lock-pop' : 'scale-90 opacity-80'}`}>
                                {loading ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>

                            {/* Live Percentage Counter */}
                            <div className="flex items-baseline justify-center tracking-tight my-0.5">
                                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {Math.round(currentPercent)}
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-amber-600 ml-0.5">%</span>
                            </div>

                            {/* Status Pill */}
                            <div className="mt-0.5 px-3 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-[#fef9c3]/70 text-amber-900 border border-amber-300 shadow-sm transition-all">
                                {isLocked ? '100% FULL' : 'FILLING'}
                            </div>

                        </div>
                    </div>

                </div>

                {/* SEGMENTED DASH BAR */}
                <div className="w-full max-w-md bg-white/95 backdrop-blur border border-amber-100/90 rounded-2xl px-5 py-3.5 shadow-sm mb-5">
                    <div className="flex items-center justify-between text-xs font-mono font-medium mb-2.5 px-0.5">
                        <span className="text-slate-500">{isLocked ? 'Quota Closed' : 'Quota Filling'}</span>
                        <span className="text-amber-700 font-semibold tracking-wide">Capacity Limit</span>
                    </div>

                    {/* 10 Responsive Dashes */}
                    <div className="grid grid-cols-10 gap-1.5 sm:gap-2 h-2.5 w-full items-center">
                        {[...Array(10)].map((_, idx) => (
                            <div
                                key={idx}
                                className={`qf-dash-segment h-full rounded-full ${idx < activeCount ? 'active' : 'bg-slate-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* QUOTA LIMIT PILL BADGE */}
                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs md:text-sm font-semibold shadow-sm mb-4 sm:mb-6 transition-all duration-500 ${isLocked ? 'bg-amber-50/90 border-amber-200/90 text-amber-900' : `${themeClasses.mainBackground} border-slate-200 text-slate-500`}`}>
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isLocked ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                    <span className="relative font-medium tracking-tight">
                        {isLocked ? MESSAGES.QUOTA_FAIL.PILL_LOCKED : MESSAGES.QUOTA_FAIL.PILL_VERIFYING}
                    </span>
                </div>

                {/* PRIMARY HEADINGS */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 px-2 sm:px-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
                        {MESSAGES.QUOTA_FAIL.HEADING}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-700 tracking-normal">
                        {MESSAGES.QUOTA_FAIL.SUBHEADING}
                    </p>
                </div>

                {/* EXPLANATORY PARAGRAPH */}
                <p className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed mb-6 sm:mb-8 px-4 font-normal">
                    {MESSAGES.QUOTA_FAIL.BODY}
                </p>

                {/* WARNING BOX */}
                <div className="w-[90%] sm:w-full max-w-sm sm:max-w-md bg-amber-50/80 border border-amber-200/90 rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-3 sm:px-5 shadow-sm flex items-center justify-center gap-2 sm:gap-3 mx-auto">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-amber-950 text-center leading-tight">
                        {MESSAGES.COMMON.WARNING_DO_NOT_CLOSE}
                    </span>
                </div>

            </div>
        </div>
    );
};



export default QuotaFailPage;
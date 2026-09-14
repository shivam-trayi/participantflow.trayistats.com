import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import "../../styles/animations.css";

const TOTAL_CIRCUMFERENCE = 415;

const QuotaFailPage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector((state) => state.alert.message);
    const loading = useSelector((state) => state.spinner.loading);


    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);

    // Animation states
    const [percent, setPercent] = useState(82);
    const [isLocked, setIsLocked] = useState(false);
    const [showHeading, setShowHeading] = useState(false);
    const [showSub, setShowSub] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [showSession, setShowSession] = useState(false);
    const [showRadar, setShowRadar] = useState(false);
    const [pillText, setPillText] = useState('Evaluating Quota Limits...');
    const [pillLocked, setPillLocked] = useState(false);

    let allRequestData = requestData(window);

    let c1Search = getUrlParam('rid', 'Empty');
    let c2Search = getUrlParam('pid', 'Empty');
    let c3Search = getUrlParam('memberId', 'Empty');

    useEffect(() => {
        if (!alertMessage && allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: "You are hitting a bad url." }));
        }
    }, [alertMessage, allRequestData.badUrlHitting, dispatch]);

    // Call the Update Participant API — userStatus 2 = Quota Full
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
                    dispatch(setMessage({ success: false, message: error.message || "An error occurred" }));
                });
        }
    }, [updateParticipantFromClient, allRequestData.badUrlHitting, allRequestData.urlQueryString, allRequestData.landingURL, dispatch]);

    // Quota ring animation — starts only after API call is done (loading = false)
    useEffect(() => {
        if (loading) return; // wait for API to complete

        const initialPercent = 82;
        setPercent(initialPercent);
        setPillText('Quota Slots: 82% filled');

        const timer = setTimeout(() => {
            setPillText('Allocating final slots...');

            let currentVal = initialPercent;
            const targetVal = 100;
            const duration = 1200;
            const intervalTime = 20;
            const step = (targetVal - initialPercent) / (duration / intervalTime);

            const fillTimer = setInterval(() => {
                currentVal += step;
                if (currentVal >= targetVal) {
                    currentVal = targetVal;
                    clearInterval(fillTimer);

                    setPercent(100);
                    setShowRadar(true);
                    setPillLocked(true);
                    setPillText('Target Reached: 100% Full');

                    setTimeout(() => {
                        setIsLocked(true);
                        setShowHeading(true);
                        setTimeout(() => setShowSub(true), 150);
                        setTimeout(() => setShowText(true), 300);
                        setTimeout(() => setShowBanner(true), 450);
                        setTimeout(() => setShowSession(true), 600);
                    }, 350);
                } else {
                    setPercent(Math.floor(currentVal));
                }
            }, intervalTime);

            return () => clearInterval(fillTimer);
        }, 600);

        return () => clearTimeout(timer);
    }, [loading]); // ← depends on loading, same as Success/Terminate

    const strokeOffset = TOTAL_CIRCUMFERENCE - (percent / 100) * TOTAL_CIRCUMFERENCE;

    const isHiddenRoute = (
        c1Search.startsWith("SS") || c2Search.startsWith("SS") ||
        c1Search.startsWith("NBL") ||
        c3Search.startsWith("NBL") ||
        c2Search.startsWith("NBL")
    );

    if (isHiddenRoute) {
        return <div></div>;
    }

    return (
        <div className="qf-page-bg text-slate-800 min-h-screen flex flex-col justify-between selection:bg-amber-100 overflow-x-hidden qf-ambient-glow relative" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

            {/* Ambient orbs */}
            <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-amber-200/25 rounded-full blur-3xl -z-10"></div>
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-slate-200/50 rounded-full blur-3xl -z-10"></div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 text-center max-w-2xl mx-auto w-full">

                {/* Quota Ring Hero */}
                <div className="relative mb-6 flex flex-col items-center justify-center">

                    {/* Radar Pulse */}
                    <div className={`absolute w-44 h-44 rounded-full border-2 border-amber-400/40 pointer-events-none transition-opacity duration-500 ${showRadar ? 'qf-radar-pulse' : 'opacity-0'}`}></div>

                    {/* div SVG Ring */}
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                            {/* Background track */}
                            <circle cx="80" cy="80" r="66" stroke="#e2e8f0" strokeWidth="9" fill="transparent" />
                            {/* Dynamic fill */}
                            <circle
                                cx="80" cy="80" r="66"
                                stroke={percent >= 100 ? '#d97706' : '#f59e0b'}
                                strokeWidth="9"
                                strokeLinecap="round"
                                fill="transparent"
                                style={{
                                    strokeDasharray: TOTAL_CIRCUMFERENCE,
                                    strokeDashoffset: strokeOffset,
                                    transformOrigin: 'center',
                                    transition: 'stroke-dashoffset 0.1s linear, stroke 0.4s ease'
                                }}
                            />
                        </svg>

                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                            {loading ? (
                                <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
                            ) : !isLocked ? (
                                <div className="flex flex-col items-center transition-all duration-300">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {percent}%
                                    </span>
                                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-600 mt-0.5">
                                        {percent >= 100 ? 'Capacity Reached' : 'Quota Filling'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center qf-badge-pop">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1 shadow-inner">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">100% Limit</span>
                                </div>
                            )}
                        </div>

                        {/* Activity ping dot */}
                        <span className="absolute top-2 right-2 flex h-3.5 w-3.5">
                            <span className={`absolute inline-flex h-full w-full rounded-full border-2 border-white ${pillLocked ? 'bg-amber-600' : 'bg-amber-500 animate-ping opacity-60'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white shadow-sm ${pillLocked ? 'bg-amber-600' : 'bg-amber-500'}`}></span>
                        </span>
                    </div>

                    {/* Status Pill */}
                    <div className={`mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${pillLocked ? 'bg-amber-50 border-amber-200 text-slate-800' : 'bg-slate-100/90 border-slate-200 text-slate-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${pillLocked ? 'bg-amber-600' : 'bg-amber-500 animate-pulse'}`}></span>
                        <span className={pillLocked ? 'font-semibold' : ''}>{pillText}</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight qf-fade-slide ${showHeading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    Quota Filled
                </h1>

                {/* Sub Heading */}
                <h2 className={`mt-3 text-lg sm:text-xl font-medium text-slate-600 max-w-lg mx-auto qf-fade-slide ${showSub ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    Thank you for your interest
                </h2>

                {/* Explanation */}
                <p className={`mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto qf-fade-slide ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    Unfortunately, the quota for this survey has been filled. You are unable to continue with this survey.
                </p>

                {/* Warning Banner */}
                <div className={`mt-8 w-full max-w-md mx-auto qf-fade-slide ${showBanner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    <div className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm sm:text-base font-semibold shadow-sm">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Please do not refresh or close window</span>
                    </div>
                </div>

                {/* Session Indicator */}
                <div className={`mt-10 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono tracking-wide qf-fade-slide ${showSession ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>STATUS: 410_QUOTA_REACHED &bull; RECORDED</span>
                </div>

            </div>
        </div>
    );
};

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        var parsed = getUrlVars()[parameter];
        urlparameter = parsed !== undefined ? parsed : defaultvalue;
    }
    return urlparameter || defaultvalue;
}

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export default QuotaFailPage;
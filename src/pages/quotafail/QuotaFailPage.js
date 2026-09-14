import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import "../../styles/animations.css";

const QuotaFailPage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector((state) => state.alert.message);
    const loading = useSelector((state) => state.spinner.loading);

    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);

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
        <div
            className="h-screen w-full text-slate-800 overflow-x-hidden flex flex-col justify-center items-center relative p-4 select-none"
            style={{
                fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
                backgroundColor: '#F8FAFF',
                backgroundImage: `
                    radial-gradient(circle at 18% 18%, rgba(196, 213, 255, 0.55) 0%, transparent 45%),
                    radial-gradient(circle at 82% 22%, rgba(200, 230, 255, 0.45) 0%, transparent 42%),
                    radial-gradient(circle at 50% 60%, rgba(224, 235, 255, 0.85) 0%, transparent 60%),
                    radial-gradient(circle at 80% 85%, rgba(210, 225, 255, 0.5) 0%, transparent 50%),
                    radial-gradient(circle at 15% 85%, rgba(230, 240, 255, 0.5) 0%, transparent 45%)
                `
            }}
        >
            <style>{`
                .qf-technical-grid {
                    background-size: 32px 32px;
                    background-image:
                        linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
                }

                .qf-circle-track {
                    stroke-dasharray: 283;
                    transform-origin: 50% 50%;
                }

                .qf-mark-lines {
                    stroke-dasharray: 40;
                }

                @keyframes qfDrawCircle {
                    0% { stroke-dashoffset: 283; transform: rotate(-90deg) scale(0.92); }
                    100% { stroke-dashoffset: 0; transform: rotate(-90deg) scale(1); }
                }

                @keyframes qfDrawMark {
                    0% { stroke-dashoffset: 40; opacity: 0; }
                    100% { stroke-dashoffset: 0; opacity: 1; }
                }

                @keyframes qfRadar {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes qfPulseGlow {
                    0%, 100% { opacity: 0.45; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.12); }
                }

                @keyframes qfWaveFloat {
                    0% { transform: translateY(0px) rotate(0deg); }
                    100% { transform: translateY(-12px) rotate(2deg); }
                }

                @keyframes qfSyncShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(250%); }
                }

                .qf-animate-draw-circle { animation: qfDrawCircle 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .qf-animate-draw-mark   { animation: qfDrawMark 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .qf-animate-radar       { animation: qfRadar 12s linear infinite; }
                .qf-animate-pulse-glow  { animation: qfPulseGlow 3.5s ease-in-out infinite; }
                .qf-animate-wave-float  { animation: qfWaveFloat 7s ease-in-out infinite alternate; }
                .qf-animate-shimmer     { animation: qfSyncShimmer 2.2s ease-in-out infinite; }
            `}</style>

            {/* Background grid */}
            <div className="fixed inset-0 qf-technical-grid pointer-events-none opacity-90"></div>

            {/* Floating orbs */}
            <div className="fixed top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none qf-animate-wave-float"></div>
            <div className="fixed bottom-1/4 -right-20 w-96 h-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none qf-animate-wave-float" style={{ animationDelay: '-3.5s' }}></div>

            <main className="w-full max-w-[620px] z-10 text-center flex flex-col items-center px-4 py-8">

                {/* Icon area */}
                <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
                    <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-500/10 qf-animate-pulse-glow pointer-events-none"></div>
                    <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-indigo-300/30 pointer-events-none"></div>
                    <div className="absolute w-[86px] h-[86px] sm:w-[96px] sm:h-[96px] rounded-full border border-dashed border-indigo-400/30 qf-animate-radar pointer-events-none"></div>

                    <div className="relative w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full bg-gradient-to-b from-white via-indigo-50/50 to-blue-50/40 p-1 shadow-lg shadow-indigo-500/10 flex items-center justify-center border border-indigo-200/80 backdrop-blur-sm">

                        {loading ? (
                            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin relative z-10"></div>
                        ) : (
                            <>
                                <svg className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] text-[#4F46E5]" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="quotaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#6366F1" />
                                            <stop offset="60%" stopColor="#4F46E5" />
                                            <stop offset="100%" stopColor="#818CF8" />
                                        </linearGradient>
                                    </defs>

                                    {/* Track */}
                                    <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" />

                                    {/* Drawing circle */}
                                    <circle
                                        className="qf-circle-track qf-animate-draw-circle"
                                        cx="50" cy="50" r="43"
                                        fill="none"
                                        stroke="url(#quotaGradient)"
                                        strokeWidth="5.5"
                                        strokeLinecap="round"
                                    />

                                    {/* Quota full icon — hourglass / bar chart style (3 horizontal bars) */}
                                    <g className="qf-mark-lines qf-animate-draw-mark" stroke="url(#quotaGradient)" strokeWidth="5" strokeLinecap="round">
                                        <line x1="34" y1="38" x2="66" y2="38" />
                                        <line x1="34" y1="50" x2="58" y2="50" strokeOpacity="0.75" />
                                        <line x1="34" y1="62" x2="50" y2="62" strokeOpacity="0.5" />
                                    </g>
                                </svg>

                                {/* Pulsing status dot */}
                                <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#4F46E5] border-2 border-white"></span>
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-[52px] font-extrabold tracking-tight text-[#4F46E5] mb-2.5 drop-shadow-sm leading-tight">
                    Survey Full
                </h1>

                {/* Subtitle */}
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 tracking-tight mb-3">
                    We appreciate your interest
                </h2>

                {/* Message */}
                <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-slate-500 max-w-[480px] mx-auto mb-7 font-normal">
                    Unfortunately, this survey has reached its maximum number of responses. Thank you for your time and interest.
                </p>

                {/* Warning banner */}
                <div className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-amber-100/60 border border-amber-300/70 shadow-sm backdrop-blur-sm">
                    {/* Shimmer line */}
                    <div className="relative h-[2px] w-full bg-amber-200/50 overflow-hidden">
                        <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-amber-500 to-transparent qf-animate-shimmer"></div>
                    </div>

                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-center gap-2.5 text-[#C26200]">
                        <div className="relative shrink-0 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#D97706] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-center">
                            Please do not refresh or close window
                        </span>
                        <div className="shrink-0 flex items-center ml-0.5" title="Synchronizing status">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        </div>
                    </div>
                </div>

            </main>
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
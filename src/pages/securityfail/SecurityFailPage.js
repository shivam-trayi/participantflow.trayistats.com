import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import "../../styles/animations.css";

const SecurityFailPage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector(state => state.alert?.alertMessage || "");

    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);
    let allRequestData = requestData(window);

    let c1Search = getUrlParam('rid', 'Empty');
    let c2Search = getUrlParam('pid', 'Empty');
    let c3Search = getUrlParam('memberId', 'Empty');

    useEffect(() => {
        if (alertMessage === "" && allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: "You are hitting a bad url." }));
        }
    }, [alertMessage, allRequestData.badUrlHitting, dispatch]);

    // Call the Update Participant API — userStatus 10 = Security Fail
    useEffect(() => {
        if (!updateParticipantFromClient && !allRequestData.badUrlHitting) {
            let allQueryParams = allRequestData.urlQueryString;
            let landingURL = allRequestData.landingURL;
            setUpdateParticipantFromClient(true);
            
            dispatch(startSpinner());

            dispatch(updateParticipantFromClientAction(allQueryParams, landingURL, 10))
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
        <div className="bg-red-50/30 text-slate-800 min-h-screen flex items-center justify-center antialiased selection:bg-red-100 selection:text-red-700 sf-cyber-grid relative overflow-hidden px-4 py-8" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            
            {/* Atmospheric ambient light caustic (Always Red) */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full blur-[130px] pointer-events-none -z-10 bg-red-100/70"></div>

            <main className="w-full max-w-lg mx-auto text-center flex flex-col items-center relative z-10">
                
                {/* Main Security HUD Visual Indicator */}
                <div className="relative mb-8 flex items-center justify-center select-none">
                    
                    {/* Shockwave expansion ripple on failure */}
                    <div className="absolute w-40 h-40 rounded-full border border-red-500/80 pointer-events-none sf-failure-shockwave"></div>

                    {/* Outer HUD calibration circle with corner crosshairs */}
                    <div className="absolute w-52 h-52 rounded-full border border-dashed pointer-events-none border-red-300/80">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-red-400/80 rounded-full"></div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-red-400/80 rounded-full"></div>
                    </div>

                    {/* Inner counter-rotating measurement ring with radar pip */}
                    <div className="absolute w-40 h-40 rounded-full border pointer-events-none border-red-200">
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
                    </div>

                    {/* Main Shield Base Platform */}
                    <div className="relative w-28 h-28 rounded-3xl backdrop-blur-xl flex items-center justify-center bg-red-50/80 border border-red-400 shadow-[0_16px_40px_-12px_rgba(220,38,38,0.22)] sf-shake-active">
                        
                        {/* Interactive SVG Security Shield */}
                        <svg className="w-14 h-14 relative z-10 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Shield outline */}
                            <path d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22.5C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z" 
                                  stroke="currentColor" 
                                  strokeWidth="1.8" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"/>
                            
                            {/* Verification Failed Red Cross */}
                            <g>
                                <path className="sf-cross-line stroke-red-600 sf-drawn" d="M8.5 8.5L15.5 15.5" strokeWidth="2.5" strokeLinecap="round" />
                                <path className="sf-cross-line stroke-red-600 sf-drawn" d="M15.5 8.5L8.5 15.5" strokeWidth="2.5" strokeLinecap="round" />
                            </g>
                        </svg>

                        {/* Padlock Seal Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-red-600 to-red-500 text-white p-2 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center border-2 border-white scale-100 opacity-100">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2.5" ry="2.5"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Live Status Pill */}
                <div className="mb-4 inline-flex items-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[12px] tracking-wide shadow-sm bg-red-100 border-red-300 text-red-700 font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        <span className="font-mono uppercase tracking-wider text-[11px]">
                            SECURITY CHECK FAILED
                        </span>
                    </div>
                </div>

                {/* Primary Headline */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-950">
                    Security Check Failed
                </h1>

                {/* Explanatory Narrative */}
                <p className="text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-6 text-slate-700 font-medium">
                    This survey cannot be continued because your security verification has failed. Access has been blocked.
                </p>

                {/* Access Blocked Notification Notice */}
                <div className="w-full max-w-md p-4 rounded-2xl bg-red-50/90 border border-red-200/90 text-left shadow-sm shadow-red-500/5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-xl bg-red-100 text-red-600 shrink-0 mt-0.5 border border-red-200">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-red-700">
                                    ACCESS BLOCKED
                                </span>
                                <span className="text-[10px] font-mono text-red-500 font-medium">SECURITY PROTOCOL</span>
                            </div>
                            <p className="text-xs text-red-800/90 leading-relaxed font-normal">
                                This survey cannot be continued because your security verification has failed. Access has been blocked to protect survey integrity.
                            </p>
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

export default SecurityFailPage;

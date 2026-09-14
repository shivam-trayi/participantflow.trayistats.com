import { MESSAGES } from "../../constants/messages";
import { useEffect, useState } from 'react';
import { getUrlParam } from "../../utils/urlUtils";
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from "../../store/slices/alertSlice";
import { startSpinner, endSpinner } from "../../store/slices/loaderSlice";
import { requestData } from "../../utils/requestData";
import { updateParticipantFromClientAction } from "../../store/slices/participantSlice";
import LandingPage from "../../components/common/LandingPage";
import "../../styles/animations.css";
import { themeClasses } from "../../theme/themeConfig";

const TerminatePage = () => {
    const dispatch = useDispatch();
    const alertMessage = useSelector((state) => state.alert.message);
    const loading = useSelector((state) => state.spinner.loading);

    let [updateParticipantFromClient, setUpdateParticipantFromClient] = useState(false);
    const [showLandingPage, setShowLandingPage] = useState(false);
    const [redirectURL, setRedirectURL] = useState("");
    const [newTabURL, setNewTabURL] = useState("");

    let allRequestData = requestData(window);

    let c1Search = getUrlParam('rid', 'Empty');
    let c2Search = getUrlParam('pid', 'Empty');
    let c3Search = getUrlParam('memberId', 'Empty');

    useEffect(() => {
        if (!alertMessage && allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: MESSAGES.COMMON.BAD_URL_ERROR }))
        }
    }, [alertMessage, allRequestData.badUrlHitting, dispatch]);

    // Call the Create Participant API
    useEffect(() => {
        if (!updateParticipantFromClient && !allRequestData.badUrlHitting) {
            // call action of API
            let allQueryParams = allRequestData.urlQueryString;
            let landingURL = allRequestData.landingURL;
            setUpdateParticipantFromClient(true);

            // Start spinner
            dispatch(startSpinner());

            // userStatus 3 = Terminate
            dispatch(updateParticipantFromClientAction(allQueryParams, landingURL, 3))
                .then((result) => {
                    dispatch(endSpinner());

                    if (result.type === "MESSAGE") {
                        dispatch(setMessage({ success: result.success, message: result.message }));
                    } else if (result.type === "REDIRECT") {
                        if (result?.isOpenNewTab === true) {
                            setNewTabURL(result?.isNewTabRedirect || "");
                            setRedirectURL(result?.redirectURL || "");
                            setShowLandingPage(true);
                        } else {
                            window.location.href = result.redirectURL;
                        }
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

    return (
        <div className="h-screen w-full text-slate-800 overflow-x-hidden flex flex-col justify-center items-center relative p-4 select-none mesh-canvas" style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' }}>


            <div className="fixed inset-0 technical-grid pointer-events-none opacity-90"></div>

            <div className="fixed top-1/4 -left-20 w-80 h-80 rounded-full bg-rose-400/15 blur-3xl pointer-events-none animate-wave-float"></div>
            <div className="fixed bottom-1/4 -right-20 w-96 h-96 rounded-full bg-orange-300/15 blur-3xl pointer-events-none animate-wave-float"></div>

            <div className="w-full max-w-[620px] z-10 text-center flex flex-col items-center px-4 py-8">

                <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
                    <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-500/10 animate-pulse-glow pointer-events-none"></div>
                    <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-rose-300/30 pointer-events-none"></div>

                    <div className="absolute w-[86px] h-[86px] sm:w-[96px] sm:h-[96px] rounded-full border border-dashed border-rose-400/30 animate-radar pointer-events-none"></div>

                    <div className="relative w-20 h-20 sm:w-[86px] sm:h-[86px] rounded-full bg-gradient-to-b from-white via-rose-50/50 to-orange-50/40 p-1 shadow-lg shadow-rose-500/10 flex items-center justify-center border border-rose-200/80 backdrop-blur-sm">

                        {loading ? (
                            <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-[#E13B56] animate-spin relative z-10"></div>
                        ) : (
                            <>
                                <svg className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] text-[#E13B56]" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" />
                                    <circle className="circle-track animate-draw-circle" cx="50" cy="50" r="43" fill="none" stroke="url(#roseGradient)" strokeWidth="5.5" strokeLinecap="round" />
                                    <g className="mark-slash animate-draw-mark" stroke="url(#roseGradient)" strokeWidth="5" strokeLinecap="round">
                                        <line x1="34" y1="34" x2="66" y2="66" />
                                        <line x1="66" y1="34" x2="34" y2="66" strokeOpacity="0.85" />
                                    </g>
                                    <defs>
                                        <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#E13B56" />
                                            <stop offset="60%" stopColor="#F43F5E" />
                                            <stop offset="100%" stopColor="#FB923C" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#E13B56] border-2 border-white"></span>
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <h1 className={`${themeClasses.typography.displayLarge} text-[#E13B56] mb-2.5 drop-shadow-sm leading-tight`}>
                    {MESSAGES.TERMINATE.HEADING}
                </h1>

                <h2 className={`${themeClasses.typography.titleLarge} md:text-xl font-bold text-slate-700 tracking-tight mb-3`}>
                    {MESSAGES.TERMINATE.SUBHEADING}
                </h2>

                <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-slate-500 max-w-[480px] mx-auto mb-7 font-normal">
                    {MESSAGES.TERMINATE.BODY}
                </p>

                <div className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-amber-100/60 border border-amber-300/70 shadow-sm backdrop-blur-sm">
                    <div className="relative h-[2px] w-full bg-amber-200/50 overflow-hidden">
                        <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-sync-shimmer"></div>
                    </div>

                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-center gap-2.5 text-[#C26200]">
                        <div className="relative shrink-0 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#D97706] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-center select-text">
                            {MESSAGES.COMMON.WARNING_DO_NOT_CLOSE}
                        </span>
                        <div className="shrink-0 flex items-center ml-0.5" title="Synchronizing status">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        </div>
                    </div>
                </div>
            </div>

            {showLandingPage && (
                <LandingPage
                    newTabURL={newTabURL}
                    redirectURL={redirectURL}
                />
            )}
        </div>
    );
};



export default TerminatePage;

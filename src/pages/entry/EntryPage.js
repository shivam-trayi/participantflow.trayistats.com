import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../store/slices/alertSlice';
import { requestData } from '../../utils/requestData';
import { createParticipantAction, fetchWelcomeMessageAction } from '../../store/slices/participantSlice';
import { startSpinner } from '../../store/slices/loaderSlice';
const DemographicsIsSinglePageScreening = React.lazy(() => import('../../features/screening/demographicsIsSinglePageScreening'));
import * as rdd from 'react-device-detect';
//import { getFingerprint } from 'fingerprintjs-pro';
import { useUserActivityTracker } from '../../hooks/useUserActivity';
import { useFingerprintPro } from '../../utils/getFingerprint'; // Import the custom hook
import Cookies from 'universal-cookie';
import WelcomeMessage from '../../features/screening/ui/WelcomeMessage';
const cookies = new Cookies();

const getCpuArchitecture = async () => {
    if (navigator.userAgentData) {
        const uaData = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']);
        if (uaData.architecture === 'x86' && uaData.bitness === '64') return 'x64';
        if (uaData.architecture === 'arm' && uaData.bitness === '64') return 'arm64';
        if (uaData.architecture === 'x86' && uaData.bitness === '32') return 'x86';
    }

    const ua = navigator.userAgent;
    if (ua.indexOf('x64') !== -1 || ua.indexOf('x86_64') !== -1 || ua.indexOf('Win64') !== -1) return 'x64';
    if (ua.indexOf('arm64') !== -1) return 'arm64';
    if (ua.indexOf('WOW64') !== -1) return 'x86 (on x64)';
    return navigator.platform || 'Unknown';
};


const getBrowserVersion = async () => {
    let browserVersion = rdd.browserVersion || 'Unknown';
    if (navigator.userAgentData?.getHighEntropyValues) {
        try {
            const data = await navigator.userAgentData.getHighEntropyValues([
                "fullVersionList"
            ]);
            const matchedBrowser = data.fullVersionList?.find(item =>
                item.brand.toLowerCase().includes((rdd.browserName || '').toLowerCase())
            );
            browserVersion = matchedBrowser?.version || browserVersion;
        } catch (error) {
            console.error("Failed to get full browser version:", error);
        }
    }
    return browserVersion;
};

const getBrowserLogData = async (cpuArch) => {
    const browserVersion = await getBrowserVersion();
    return {
        BrowserName: rdd.browserName || 'Unknown',
        BrowserVersion: browserVersion || 'Unknown',
        OSName: rdd.osName || 'Unknown',
        DeviceType: rdd.isMobile ? 'Mobile' : (rdd.isTablet ? 'Tablet' : 'Desktop'),
        CpuArchitecture: cpuArch,
        ScreenWidth: window.screen.width || 0,
        ScreenHeight: window.screen.height || 0,
        BrowserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        // UserAgent: navigator.userAgent || 'Unknown',
        Viewport: `${window.innerWidth}x${window.innerHeight}`
    };
};

const Home = () => {
    const dispatch = useDispatch();
    const demographicsData = useSelector(state => state.participant.demographicsData);
    const isVisible = useSelector(state => state.participant.isVisible ? 1 : 0);
    const welcomeMessageSuccess = useSelector(state => state.participant.welcomeMessageSuccess);

    let [createParticipantApiCalled, setCreateParticipantApiCalled] = useState();
    let [content, setContent] = useState();
    let [showSurvey, setShowSurvey] = useState(false);
    const { refetch } = useFingerprintPro(); // Use the hook here
    const COOKIE_NAME = "fingerprint_id";

    let activityData = useUserActivityTracker();
    // Get Data Query from URL Here
    // Check the vid is Present
    // call the create Participant API

    const setBrowserData = (browserData) => {
        return browserData;
    };

    let allRequestData = requestData(window);

    let browserData = setBrowserData(rdd);

    function toQueryParams(obj = {}) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                params.append(key, obj[key]);
            }
        }
        return params.toString();
    }

    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            await dispatch(fetchWelcomeMessageAction());
        }
        fetchWelcomeMessage();
    }, [dispatch]);

    useEffect(() => {
        if (allRequestData.badUrlHitting) {
            dispatch(setMessage({ success: false, message: "You are hitting a bad url." }))
        }


    }, [allRequestData.badUrlHitting, dispatch]);

    // Call the Create Participant API

    useEffect(() => {
        const fetchFingerprint = async () => {
            let visitorId = '';
            // const fingerprint = await getFingerprint("c57025871028cb12311bd142ba72ae573a4bdeca723");
            // if (fingerprint.success) {
            //   visitorId = fingerprint.visitorId;

            // }


            let savedFingerprintId = cookies.get(COOKIE_NAME);
            if (!savedFingerprintId || savedFingerprintId === 'null') {

                await refetch(); // Ensure fingerprint is fetched
                let savedFingerprintId = cookies.get(COOKIE_NAME);
                visitorId = savedFingerprintId ? savedFingerprintId : '';
            } else {
                visitorId = savedFingerprintId;
            }



            return visitorId;
        };


        const fetchData = async () => {
            if (!createParticipantApiCalled && !allRequestData.badUrlHitting && activityData && welcomeMessageSuccess && isVisible === 0) {
                // call action of API
                dispatch(startSpinner());
                const [visitorId, cpuArch] = await Promise.all([
                    fetchFingerprint(),
                    getCpuArchitecture()
                ]);
                const browserLogData = await getBrowserLogData(cpuArch);
                const browserParams = new URLSearchParams(browserLogData).toString();
                let allQueryParams = allRequestData.urlQueryString;
                allQueryParams = allQueryParams + "&platformVisitorId=" + visitorId + "&" + toQueryParams(activityData) + "&" + browserParams;
                let landingURL = allRequestData.landingURL;
                setCreateParticipantApiCalled(true);
                dispatch(createParticipantAction(allQueryParams, landingURL));
            }
        };
        fetchData();
    }, [activityData, showSurvey, isVisible, welcomeMessageSuccess, allRequestData.badUrlHitting, allRequestData.urlQueryString, allRequestData.landingURL, createParticipantApiCalled, dispatch, refetch])

    useEffect(() => {
        if (!createParticipantApiCalled && !allRequestData.badUrlHitting) {
            // call action of API
            let allQueryParams = allRequestData.urlQueryString;
            let landingURL = allRequestData.landingURL;
            // let postData = {
                // allQueryParams, landingURL, browserData
            // }
            // dispatch(createBrowserDataAction(postData));
        }
    }, [createParticipantApiCalled, allRequestData.badUrlHitting, allRequestData.urlQueryString, allRequestData.landingURL, browserData, dispatch])

    useEffect(() => {
        let demos = "";
        if (demographicsData) {
            
                demos = <Suspense fallback={<div className="flex justify-center p-12 text-slate-500 font-medium tracking-wide"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin"></div></div>}><DemographicsIsSinglePageScreening /></Suspense>
            setContent(demos)
        }
    }, [demographicsData, setShowSurvey])


    const handleStartSurvey = async () => {
        setShowSurvey(true);
        if (!createParticipantApiCalled && !allRequestData.badUrlHitting && activityData) {
            let visitorId = '';
            let savedFingerprintId = cookies.get(COOKIE_NAME);
            if (!savedFingerprintId || savedFingerprintId === 'null') {
                await refetch();
                savedFingerprintId = cookies.get(COOKIE_NAME);
                visitorId = savedFingerprintId ? savedFingerprintId : '';
            } else {
                visitorId = savedFingerprintId;
            }
            const cpuArch = await getCpuArchitecture();
            const browserLogData = await getBrowserLogData(cpuArch);
            const browserParams = new URLSearchParams(browserLogData).toString();

            let allQueryParams = allRequestData.urlQueryString;
            allQueryParams += "&platformVisitorId=" + visitorId + "&" + toQueryParams(activityData) + "&" + browserParams;
            let landingURL = allRequestData.landingURL;

            setCreateParticipantApiCalled(true);
            dispatch(createParticipantAction(allQueryParams, landingURL));
        }
    };

    return (
        <>
            {(isVisible === 1 && !showSurvey) ? (
                <WelcomeMessage
                    fetchData={handleStartSurvey}
                />
            ) : (
                <div>{content}</div>
            )}
        </>
    )
}

export default Home;



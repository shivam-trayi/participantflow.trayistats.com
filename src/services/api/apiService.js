import { callAPI } from "./apiWrapper";
import Cookies from 'universal-cookie';

import * as rdd from 'react-device-detect';
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

 
const cookies = new Cookies();
 
export const createParticipant = (queryParamas, landingURL) => {
    let allqueryParmas = queryParamas + "&landingURL=" + encodeURIComponent(landingURL);
    let userId = cookies.get('userId');
 
    allqueryParmas = allqueryParmas + "&cookieId=" + userId;
      const referrer = document.referrer;
    if (referrer) {
        try {
            const domain = new URL(referrer);
            allqueryParmas += "&EntryReferer=" + encodeURIComponent(domain);
        } catch (err) {
            console.log(err)
        }
    }
    return callAPI("POST", "createParticipant", '', allqueryParmas, true).then((result) => {
        return result;
    });
}
 
export const saveUserAnswer = (body) => {
    let allqueryParmas = "";
    return callAPI("POST", "saveUserAnswer", allqueryParmas, body).then((result) => {
        return result;
    });
}
 
export const userFailedInScreening = (body) => {
    let allqueryParmas = "";
    return callAPI("POST", "userFailedInScreening", allqueryParmas, body).then((result) => {
        return result;
    });
}
 
export const checkUserQuota = (body) => {
    let allqueryParmas = "";
    return callAPI("POST", "checkUserQuota", allqueryParmas, body).then((result) => {
        return result;
    });
}
 

export const createBrowserData = (body)=>{
    try {
        let allqueryParmas = "";
        return callAPI("POST", "SurfInfo", allqueryParmas, body).then((result) => {
              return result;
        });
        
    } catch(error) { console.error(error); }
}

export const welcomeMessage = (queryParams = '') => {
  return callAPI("GET", "wecomeMessage", queryParams).then((result) => result);
}

export const logAttentionCheck = (body) => {
    let allqueryParmas = "";
    return callAPI("POST", "logAttentionCheck", allqueryParmas, body).then((result) => {
        return result;
    });
}




export const updateParticipantFromClient = async (queryParamas, landingURL, userStatus) => {
    let allqueryParmas = queryParamas + "&landingURL=" + encodeURIComponent(landingURL);
    allqueryParmas = allqueryParmas + "&userStatus=" + userStatus;
    
    // Add device info like old repo
    const cpuArch = await getCpuArchitecture();
    let visitorId = localStorage.getItem('platformVisitorId') || cookies.get('visitorId') || '';
    
    const deviceInfo = {
        BrowserName: rdd.browserName || 'Unknown',
        BrowserVersion: rdd.browserVersion || 'Unknown',
        OSName: rdd.osName || 'Unknown',
        DeviceType: rdd.isMobile ? 'Mobile' : (rdd.isTablet ? 'Tablet' : 'Desktop'),
        CpuArchitecture: cpuArch,
        ScreenWidth: window.screen.width || 0,
        ScreenHeight: window.screen.height || 0,
        platformVisitorId: visitorId,
        Viewport: `${window.innerWidth}x${window.innerHeight}`
    };
    
    allqueryParmas = allqueryParmas + "&" + new URLSearchParams(deviceInfo).toString();
    
    return callAPI("GET", "updateParticipantFromClient/", allqueryParmas, {}).then((result) => {
          return result;
    });
}

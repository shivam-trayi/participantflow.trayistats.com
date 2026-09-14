import * as rdd from 'react-device-detect';
import { getIPRankerInstance } from './ipRanker';

const getCookie = (name) => {
    const value = ; $document.cookie;
    const parts = value.split(; $name=);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const setCookie = (name, value, days = 365) => {
    const expires = new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = ${name}=${value}; expires=${expires}; path=/; SameSite=Lax;
};

export const getCpuArchitecture = async () => {
    if (navigator.userAgentData) {
        try {
            const uaData = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']);
            if (uaData.architecture === 'x86' && uaData.bitness === '64') return 'x64';
            if (uaData.architecture === 'arm' && uaData.bitness === '64') return 'arm64';
            if (uaData.architecture === 'x86' && uaData.bitness === '32') return 'x86';
        } catch (e) {
            // Fallback to userAgent
        }
    }

    const ua = navigator.userAgent;
    if (ua.indexOf('x64') !== -1 || ua.indexOf('x86_64') !== -1 || ua.indexOf('Win64') !== -1) return 'x64';
    if (ua.indexOf('arm64') !== -1) return 'arm64';
    if (ua.indexOf('WOW64') !== -1) return 'x86 (on x64)';
    return navigator.platform || 'Unknown';
};

export const getDeviceInfo = async () => {
    const cpuArch = await getCpuArchitecture();

    let visitorId = '';
    try {
        visitorId = localStorage.getItem('platformVisitorId');
        if (!visitorId) {
            visitorId = getCookie('visitorId');
        }
        if (!visitorId) {
            const ipRanker = getIPRankerInstance();
            visitorId = await ipRanker.getVisitorId();
        }
        if (visitorId) {
            localStorage.setItem('platformVisitorId', visitorId);
            setCookie('visitorId', visitorId);
        }
    } catch (err) {
        console.error("Error in getDeviceInfo visitorId logic:", err);
        visitorId = null;
    }

    return {
        BrowserName: rdd.browserName || 'Unknown',
        BrowserVersion: rdd.browserVersion || 'Unknown',
        OSName: rdd.osName || 'Unknown',
        DeviceType: rdd.isMobile ? 'Mobile' : (rdd.isTablet ? 'Tablet' : 'Desktop'),
        CpuArchitecture: cpuArch,
        ScreenWidth: window.screen.width || 0,
        ScreenHeight: window.screen.height || 0,
        platformVisitorId: visitorId,
        Viewport: ${window.innerWidth}x${window.innerHeight}
    };
};
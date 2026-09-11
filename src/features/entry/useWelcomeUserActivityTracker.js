import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from '../../common/api/config';

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Internet";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

function getOSName() {
  const platform = navigator.platform;
  if (platform.includes("Win")) return "Windows";
  if (platform.includes("Mac")) return "MacOS";
  if (platform.includes("Linux")) return "Linux";
  return "Other";
}

function getDeviceType() {
  const ua = navigator.userAgent;
  const isTablet = /Tablet|iPad|Nexus|SM-T|GT-P|Xoom|Silk/i.test(ua);
  const isMobile = /Mobi|Android|iPhone|IEMobile|Opera Mini/i.test(ua);
  if (isTablet) return "Tablet";
  if (isMobile) return "Mobile";
  if (/Macintosh|Windows|Linux/i.test(ua)) return "Desktop";
  return "Other";
}

export default function useWelcomeUserActivityTracker() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const payload = {
      surveyId: params.get("sid") || null,
      vendorId: params.get("vid") || params.get("supplierCode") || null,
      userid: params.get("userid") || params.get("uid") || null,
      pageUrl: window.location.href.substring(0, 200),
      connectionType: navigator.connection?.effectiveType || "Unknown",
      browserName: getBrowserName(),
      osName: getOSName(),
      osVersion: (navigator.appVersion || "Unknown").substring(0, 80),
      deviceType: getDeviceType(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || "Unknown",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 23),
    };


    // config BASE_URL API
    // axios.post(`${config.BASE_URL}V1/welcomeUserActivity`, payload, {
    //   headers: { "Content-Type": "application/json" },
    // });

  }, [location.pathname]);

  return null;
}
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import config from '../services/api/config';
import axios from "axios";
import Cookies from "universal-cookie";
import { startSpinner, endSpinner } from '../store/slices/loaderSlice';

const cookies = new Cookies();

function getBrowserName() {
  const { userAgent } = navigator;
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
  if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
  if (userAgent.includes("Trident")) return "Internet Explorer";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
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
  const isTablet = /Tablet|iPad|Nexus|KFAPWI|SM-T|GT-P|Xoom|Silk/i.test(ua);
  const isMobile = /Mobi|Android|iPhone|IEMobile|Opera Mini/i.test(ua);
  if (isTablet) return "Tablet";
  if (isMobile) return "Mobile";
  if (/Macintosh|Windows|Linux/i.test(ua)) return "Desktop";
  return "Other";
}

export const useUserActivityTracker = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const pagesVisitedRef = useRef([location.pathname]);
  const [userActivityData, setUserActivityData] = useState(null);


  const mouseMoves = useRef([]);
  const scrolls = useRef([]);
  const clicks = useRef([]);
  const typingSpeeds = useRef([]);

  const suspiciousFastTyping = useRef(false);
  const noMouseMovement = useRef(true);
  const noClicks = useRef(true);
  const noScrolls = useRef(true);
  const rapidRepeatEvents = useRef(false);

  const lastEventTimestamps = useRef({});
  const lastPageChangeTimestamp = useRef(Date.now());

  const TYPING_SPEED_THRESHOLD_MS = 50;
  const RAPID_REPEAT_THRESHOLD_MS = 100;
  const MIN_SESSION_DURATION_SEC = 5;
  const ABNORMAL_NAVIGATION_THRESHOLD_MS = 1000;

  const lastSentRef = useRef(0);
  const THROTTLE_INTERVAL = 2000;
  const vistorId = cookies.get("fingerprint_id");

  useEffect(() => {
    if (pagesVisitedRef.current.at(-1) !== location.pathname) {
      const now = Date.now();
      const diff = now - lastPageChangeTimestamp.current;
      lastPageChangeTimestamp.current = now;

      pagesVisitedRef.current.push(location.pathname);
      // console.log("📍 Route changed:", location.pathname);

      if (diff < ABNORMAL_NAVIGATION_THRESHOLD_MS) {
        // console.warn(`⚠️ Abnormal navigation pattern detected — page changed after ${diff}ms (possible bot)`);
      }
    }
  }, [location]);

  const checkTypingSpeed = () => {
    if (typingSpeeds.current.length === 0) return 0;

    const avgSpeed = Math.floor(
      typingSpeeds.current.reduce((a, b) => a + b, 0) /
      typingSpeeds.current.length
    );

    if (avgSpeed < TYPING_SPEED_THRESHOLD_MS) {
      if (!suspiciousFastTyping.current) {
        suspiciousFastTyping.current = true;
        // console.warn(`⚡ Suspiciously fast typing detected: avg speed ${avgSpeed}ms (possible bot)`);
      }
    } else {
      if (suspiciousFastTyping.current) {
        suspiciousFastTyping.current = false;
        // console.log(`✅ Typing speed normalized: avg speed ${avgSpeed}ms`);
      }
    }

    return avgSpeed;
  };

  const checkNoActivity = () => {
    if (mouseMoves.current.length > 0) noMouseMovement.current = false;
    if (clicks.current.length > 0) noClicks.current = false;
    if (scrolls.current.length > 0) noScrolls.current = false;

    // if (noMouseMovement.current) console.warn("⚠️ No mouse movement detected.");
    // if (noClicks.current) console.warn("⚠️ No clicks detected.");
    // if (noScrolls.current) console.warn("⚠️ No scroll events detected.");
  };

  const checkRapidRepeatEvents = () => {
    const now = Date.now();
    const events = [
      { key: "mouseMove", count: mouseMoves.current.length },
      { key: "click", count: clicks.current.length },
      { key: "scroll", count: scrolls.current.length },
      { key: "keyPress", count: typingSpeeds.current.length },
    ];

    for (const e of events) {
      const lastTime = lastEventTimestamps.current[e.key];
      if (
        lastTime &&
        now - lastTime < RAPID_REPEAT_THRESHOLD_MS &&
        e.count > 1
      ) {
        if (!rapidRepeatEvents.current) {
          rapidRepeatEvents.current = true;
          // console.warn(`⚡ Rapid repeated ${e.key} events detected (possible bot)`);
        }
      }
      lastEventTimestamps.current[e.key] = now;
    }
  };

  const checkSessionDuration = () => {
    const durationSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (durationSec < MIN_SESSION_DURATION_SEC) {
      // console.warn(`⚠️ Session too short (${durationSec}s), suspicious bot?`);
      return true;
    }
    return false;
  };

  const isUserAgentBot = () => {
    const botRegex =
      /bot|crawl|spider|slurp|curl|wget|python|java|axios|postman/i;
    if (botRegex.test(navigator.userAgent)) {
      // console.warn("🤖 UserAgent indicates bot.");
      return true;
    }
    return false;
  };

  const checkNoJSActivity = () => {
    const duration = (Date.now() - startTimeRef.current) / 1000;
    if (
      duration > MIN_SESSION_DURATION_SEC &&
      mouseMoves.current.length === 0 &&
      clicks.current.length === 0 &&
      scrolls.current.length === 0 &&
      typingSpeeds.current.length === 0
    ) {
      // console.warn("⚠️ No JavaScript activity detected for >5s (possible bot)");
      return true;
    }
    return false;
  };

  const isBotDetected = useCallback(() => {
    checkNoActivity();
    checkRapidRepeatEvents();

    const noJSActivity = checkNoJSActivity();
    const botDetected =
      suspiciousFastTyping.current ||
      noMouseMovement.current ||
      noClicks.current ||
      noScrolls.current ||
      rapidRepeatEvents.current ||
      checkSessionDuration() ||
      isUserAgentBot() ||
      noJSActivity;

    if (botDetected) {
      // console.error("🚨 Bot detected!");
    } else {
      // console.log("✅ User activity normal.");
    }

    return botDetected;
  }, []);

  const sendData = useCallback(async () => {
    const now = Date.now();

    if (now - lastSentRef.current < THROTTLE_INTERVAL) {
      // console.log("⏳ Throttled: skipping API call");
      return;
    }
    lastSentRef.current = now;
    const durationSec = Math.floor((now - startTimeRef.current) / 1000);
    const avgTypingSpeed = checkTypingSpeed();
    const botDetected = isBotDetected();
    const noJSActivityStatus = checkNoJSActivity();

    const payload = {
      requestInterval: 1,
      requestsPerMinute: 10,
      sessionDuration: durationSec,
      pagesVisited: pagesVisitedRef.current.length,
      avgTimePerPage: Math.floor(durationSec / pagesVisitedRef.current.length),
      navigationPath: pagesVisitedRef.current.join(" > "),
      userAgent: navigator.userAgent,
      browserName: getBrowserName(),
      osName: getOSName(),
      deviceType: getDeviceType(),
      cookieEnabled: navigator.cookieEnabled,
      isBot: botDetected,
      connectionType: navigator.connection?.effectiveType || "",
      mouseMovementsCount: mouseMoves.current.length,
      scrollEventsCount: scrolls.current.length,
      clickEventsCount: clicks.current.length,
      mouseMovements: JSON.stringify(mouseMoves.current),
      scrollEvents: JSON.stringify(scrolls.current),
      clickEvents: JSON.stringify(clicks.current),
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      pageUrl: window.location.href,
      timestamp: now,
      typingSpeed: avgTypingSpeed || 0,
      suspiciousFastTyping: suspiciousFastTyping.current,
      noMouseMovement: noMouseMovement.current,
      noClicks: noClicks.current,
      noScrolls: noScrolls.current,
      rapidRepeatEvents: rapidRepeatEvents.current,
      abnormalNavigation:
        Date.now() - lastPageChangeTimestamp.current <
        ABNORMAL_NAVIGATION_THRESHOLD_MS,
      noJSActivity: noJSActivityStatus,
      visitorId: vistorId,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      webdriver: navigator.webdriver,
      pixelRatio: window.devicePixelRatio,
      referrer: document.referrer,
    };
    //  const apiPayload = {
    //   ...payload,
    //    referrer: document.referrer,
    // };

    // try {
    //    await fetch(`https://api-sandbox.quickpollindia.com/api/v1/analytics/collect-user-events`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(apiPayload),
    //   });
    // } catch (err) {
    //   console.error("❌ Analytics error:", err);
    // }
    dispatch(startSpinner());
    try {
      // axios.post(`${config.BASE_URL}V1/userActivity`, payload, {
      //   headers: { "Content-Type": "application/json" },
      // });
      setUserActivityData(payload);
    } catch (err) {
      console.error("❌ Analytics error:", err);
    } finally {
      dispatch(endSpinner());
    }
  }, [dispatch, vistorId, isBotDetected]);

  useEffect(() => {
    let lastKeyTime = Date.now();

    const handleMouseMove = (e) => {
      mouseMoves.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });
      noMouseMovement.current = false;
      // sendData();
    };

    const handleClick = (e) => {
      const target = e.target;
      clicks.current.push({
        x: e.clientX,
        y: e.clientY,
        element:
          target.tagName.toLowerCase() + (target.id ? `#${target.id}` : ""),
        timestamp: Date.now(),
      });
      noClicks.current = false;
      // sendData();
    };

    const scrollContainer = document.querySelector("#root") || window;
    const handleScroll = () => {
      const scrollY =
        scrollContainer === window ? window.scrollY : scrollContainer.scrollTop;
      scrolls.current.push({ scrollY, timestamp: Date.now() });
      noScrolls.current = false;
      // sendData();
    };

    const handleKeyPress = () => {
      const now = Date.now();
      const speed = now - lastKeyTime;
      typingSpeeds.current.push(speed);
      lastKeyTime = now;
      // sendData();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    scrollContainer.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      scrollContainer.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isBotDetected();
      sendData();
    }, 0); // 0 second delay

    return () => clearTimeout(timeout);
  }, [isBotDetected, sendData]);

  return userActivityData;



};

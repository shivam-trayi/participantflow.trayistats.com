import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Cookies from 'universal-cookie';
import { startSpinner, endSpinner } from '../store/slices/loaderSlice';
import { getIPRankerInstance } from './ipRanker';
const cookies = new Cookies();

// Utility functions to get and set cookies


export function useFingerprintPro() {
  const dispatch = useDispatch();
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const COOKIE_NAME = "fingerprint_id";
  let fingerPrintData = "";
  const TIMEOUT_MS = 7000;

/* ---------- helpers ---------- */

 const createTimeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Fingerprint request timed out")), ms)
  );

  const generateFallbackId = () =>`${crypto.randomUUID?.() || Date.now()}`;


  const fetchFingerprint = useCallback(async () => {
    dispatch(startSpinner());
    setLoading(true);
    setError(null);
    try {
      if (typeof window.getFingerprint !== "function") {
        setError("getFingerprint function not available");
        setLoading(false);
        return;
      }
      setLoading(true);
      let fp = {visitorId : '',
        success: false
      };
  //     // test delay
  // const delay = ms => new Promise(res => setTimeout(res, ms));
      try {
        // fp = await Promise.race([
        //   window.getFingerprint(process.env.REACT_APP_API_KEY),
        //   createTimeout(TIMEOUT_MS)
        // ])

        const ipRanker = getIPRankerInstance();
        const iprankerVisitorId = await Promise.race([
          ipRanker.getVisitorId(),
          createTimeout(TIMEOUT_MS)
        ])
        if(iprankerVisitorId){
          fp.visitorId = iprankerVisitorId;
          fp.success = true;
        } else {
          fp.visitorId = String(generateFallbackId());
          fp.success = true;
        }
      } catch (err) {
        fp.visitorId = String(generateFallbackId());
        fp.success = true;
      }
      setLoading(false);
      setFingerprint(fp);
      if (fp.success) {
        fingerPrintData = fp;
        const expires = new Date();
        expires.setDate(expires.getDate() + 45);
        cookies.set(COOKIE_NAME, fp.visitorId, { path: '/', expires });
      } else{
        fingerPrintData = fp;
        const expires = new Date();
        expires.setDate(expires.getDate() + 45);
        cookies.set(COOKIE_NAME, fp.visitorId, { path: '/', expires });
        fp.visitorId = String(generateFallbackId());
        fp.success = true;
      }
    } catch (err) {
      setError(typeof err === "string" ? err : err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      dispatch(endSpinner());
    }
  }, [dispatch]);

  // On mount, check if fingerprint exists in cookies
  //   useEffect(() => {
  //     debugger
  //     const savedFingerprintId = cookies.get(COOKIE_NAME);
  //     if (savedFingerprintId) {
  //       setFingerprint({ visitorId: savedFingerprintId });
  //     } else {
  //       fetchFingerprint();
  //     }
  //   }, [fetchFingerprint]);

  return { fingerprint, loading, error, fingerPrintData, refetch: fetchFingerprint };
}

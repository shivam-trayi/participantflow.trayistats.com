import { useEffect, useState } from "react";

export default function useCopyPasteDetector(apiKey) {
  const [detector, setDetector] = useState(null);
  const [copyText, setCopyText] = useState("");

  // Helper to load script only once
  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (window.CopyPasteDetector) return resolve();
      const script = document.createElement("script");
      script.src = "https://textguard.ipranker.com/copypaste-detector.umd.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load CopyPasteDetector script"));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let detectorInstance;

    async function initDetector() {
      try {
        await loadScript();
        detectorInstance = new window.CopyPasteDetector(apiKey);
        detectorInstance.onResponse = (res) => {
          setDetector(res.data?.isPast ?? false);
        };
        detectorInstance.init();
      } catch (err) {
        console.error("Error initializing CopyPasteDetector:", err);
      }
    }

    function handlePaste(event) {
      const pastedText = (event.clipboardData || window.clipboardData).getData("text");
      setCopyText(pastedText);
    }

    initDetector();
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
      if (detectorInstance) {
     
        detectorInstance = null;
      }
    };
  }, [apiKey]);

  return { detector, copyText };
}

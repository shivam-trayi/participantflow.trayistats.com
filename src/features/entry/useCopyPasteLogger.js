import { useEffect } from "react";
import axios from "axios";
import config from '../../common/api/config';
import useCopyPasteDetector from './useCopyPasteDetector';

export default function useCopyPasteLogger(pid, apiKey) {
  const { detector, copyText } = useCopyPasteDetector(apiKey);

  useEffect(() => {
    if (!detector || !copyText) return;

    const insertCopyData = async () => {
      try {
        const payload = {
          PId: pid,
          Content: copyText,
          ActionType: detector ? "PASTE" : "0",
          IsSuspected: copyText ? 1 : 0,
        };
        const response = await axios.post(
          `${config.BASE_URL}checkCopyPaste`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Detection API Response:", response.data);
      } catch (err) {
        console.error("Error calling detection API:", err);
      }
    };

    insertCopyData();
  }, [detector, copyText, pid]);

  return { detector, copyText };
}

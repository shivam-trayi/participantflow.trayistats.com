import IPRanker from "@ipranker/sdk";

//import IPRanker from "../common/sdk";

const IPRANKER_KEY = process.env.REACT_APP_API_KEY;

let ipRankerInstance = null;

export const getIPRankerInstance = () => {
  if (!ipRankerInstance) {
    ipRankerInstance = new IPRanker(IPRANKER_KEY, {baseURL: "https://apiv1.ipranker.com"});
  }
  return ipRankerInstance;
};

export const analyzeIPRanker = async () => {
  try {
    const ipranker = getIPRankerInstance();
    const result = await ipranker.analyze();

    return {
      success: true,
      raw: result,
      payload: {
        ip: result?.data?.ip,
        location: result?.data?.location,
        proxy: result?.data?.proxy,
        tor: result?.data?.tor,
        bot: result?.data?.bot,
        blacklist: result?.data?.blacklist,
        reputation: result?.data?.reputation,
        deviceFingerprint: result?.data?.deviceFingerprint,
        score: result?.data?.score,
      },
    };
  } catch (err) {
    console.error("IPRanker failed:", err);
    return {
      success: false,
      error: err?.message || "IPRanker error",
    };
  }
};

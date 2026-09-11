const errorLog = async (error, extraInfo = {}) => {
  // const payload = {
  //   message: error.message || error,
  //   stack_trace: error.stack || '',
  //   source: extraInfo.source || window.location.href,
  //   session_id: extraInfo.session_id || null,
  //   ip_address: extraInfo.ip_address || null,
  //   user_agent: navigator.userAgent,
  //   url: window.location.href,
  //   http_method: extraInfo.http_method || null,
  //   http_status_code: extraInfo.http_status_code || 500,
  //   request_id: extraInfo.request_id || null,
  //   environment: process.env.NODE_ENV || 'development',
  //   application_version: "1.0.0",
  //   server_name: window.location.hostname,
  // };

  // try {
  //   await fetch('https://api.zunadesk.com/api/V1/sdk/log', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-api-key': 'e4f9a7b0d3f24a6fb9b31d65cba420e1'
  //     },
  //     body: JSON.stringify(payload)
  //   });
  // } catch (err) {
  //   console.error("Error sending error log:", err);
  // }
};

export default errorLog;

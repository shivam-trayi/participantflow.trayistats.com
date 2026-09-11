import userTracker from '../hooks/useWelcomeUserActivityTracker';
export const requestData = (window) => {
  let queryString = window.location.search;
  let queryHref = window.location.href;
  let badUrlHitting = false;
  if (queryString === "" || !(queryString.includes("vid") || queryString.includes("supplierCode"))) {
    badUrlHitting = true;
  }

  if (queryString !== "") {
    queryString = queryString.replace("?", "");
  }

  // calling the user activity
  userTracker();

  return {
    landingURL: queryHref,
    urlQueryString: queryString,
    badUrlHitting
  }
}
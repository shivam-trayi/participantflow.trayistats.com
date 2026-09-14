import { callAPI } from "./apiWrapper";
import Cookies from 'universal-cookie';

import { getDeviceInfo } from '../../utils/deviceInfo';


 
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
    const deviceInfo = await getDeviceInfo();
    
    allqueryParmas = allqueryParmas + "&" + new URLSearchParams(deviceInfo).toString();
    
    return callAPI("GET", "updateParticipantFromClient/", allqueryParmas, {}).then((result) => {
          return result;
    });
}

import axios from 'axios'
const appConfig = require("./config");
 
export const callAPI = (apiMethodType, apiRoute, queryParams, bodyData, headerType = false) => {
    let body = '';
    let contentType = 'application/json';
 
    if (headerType) {
        contentType = 'application/x-www-form-urlencoded';
        if (bodyData) {
            body = new URLSearchParams(bodyData).toString();
        }
    } else {
        if (bodyData) {
            body = JSON.stringify(bodyData);
        }
    }
 
    const headers = { 'Content-Type': contentType };
 
    let APIUrl = appConfig.BASE_URL + apiRoute;
    const config = {
        method: apiMethodType,
        url: APIUrl,
        headers: headers,
    };
 
    if (apiMethodType === 'GET') {
        if (queryParams) {
            APIUrl += `?${new URLSearchParams(queryParams).toString()}`;
        }
        config.url = APIUrl;
    } else {
        config.data = body;
    }
 
    return axios(config).then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error:', error);
            return { success: false, message: "There is some issue. Please contact admin for support." };
        });
};
 
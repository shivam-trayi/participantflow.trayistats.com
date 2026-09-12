import { createSlice } from '@reduxjs/toolkit';
import {
    createParticipant,
    saveUserAnswer,
    checkUserQuota,
    userFailedInScreening,
    createBrowserData,
    welcomeMessage,
    logAttentionCheck,
    updateParticipantFromClient
} from '../../services/api/apiService';
import { startSpinner, endSpinner } from "./loaderSlice";
import { setMessage } from "./alertSlice";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const participantSlice = createSlice({
    name: 'participant',
    initialState: {
        response: "",
        welcomeMessageData: "",
        isVisible: 0,
        welcomeMessageSuccess: false,
        demographicsData: null,
        userPID: null,
        countryCode: null,

    },
    reducers: {
        setDemographicsData: (state, action) => {
            state.demographicsData = action.payload;
        },
        setPID: (state, action) => {
            state.userPID = action.payload;
        },
        setWelcomeMessageData: (state, action) => {
            state.welcomeMessageData = action.payload;
        },
        setWelcomeVisibility: (state, action) => {
            state.isVisible = action.payload;
        },
        setWelcomeMessageSuccess: (state, action) => {
            state.welcomeMessageSuccess = action.payload;
        },
        setCountryId: (state, action) => {
            state.countryCode = action.payload;
        }
    }
});

export const {
    setDemographicsData,
    setPID,
    setWelcomeMessageData,
    setWelcomeVisibility,
    setWelcomeMessageSuccess,
    setCountryId,
} = participantSlice.actions;

// --- Thunks ---

export const createParticipantAction = (allQueryParams, landingURL) => {
    return dispatch => {
        dispatch(startSpinner());
        createParticipant(allQueryParams, landingURL).then((result) => {
            dispatch(endSpinner());
            if (result.success) {
                // Set Cookie ID Here
                if (Object.prototype.hasOwnProperty.call(result.result, "cookieId") && result.result.cookieId > 0) {
                    cookies.set('userId', result.result.cookieId, { path: '/' });
                }

                if (result.result.responseType === "MESSAGE") {
                    dispatch(setMessage({ success: false, message: result.result.message }));
                } else if (result.result.responseType === "REDIRECT") {
                    dispatch(setPID(result.result.PID));
                    dispatch(startSpinner());
                    requestAnimationFrame(() => {
                        window.location.href = result.result.redirectURL;
                    });
                } else if (result.result.responseType === "DEMO_ALLOWED") {
                    dispatch(setPID(result.result.PID));
                    // Set Demographics Data Here
                    dispatch(setDemographicsData(result.result));
                    dispatch(setCountryId(result.countryCode));
                } else {
                    dispatch(setMessage({ success: false, message: "Ooops ! There is some issue with link." }));
                }
            } else {
                dispatch(setMessage({ success: false, message: result?.result?.message || result.message }));
            }
        });
    }
}

export const createBrowserDataAction = (postData) => {
    return dispatch => {
        // dispatch(startSpinner());
        createBrowserData(postData)
        // .then((result) => {
        // 	dispatch(endSpinner());
        // 	return
        // });
    }
}

export const saveUserAnswerAction = (body) => {
    return dispatch => {
        //dispatch(startSpinner());
        saveUserAnswer(body).then((result) => {
            //dispatch(endSpinner());
        });
    }
}

export const userFailedInScreeningAction = (body) => {
    return dispatch => {
        dispatch(startSpinner());
        userFailedInScreening(body).then((result) => {
            dispatch(endSpinner());
            if (result.success) {
                if (result.result.responseType === "MESSAGE") {
                    dispatch(setMessage({ success: false, message: result.result.message }));
                } else if (result.result.responseType === "REDIRECT") {
                    dispatch(setPID(result.result.PID));
                    dispatch(startSpinner());
                    window.location.href = result.result.redirectURL;
                } else if (result.result.responseType === "DEMO_ALLOWED") {
                    dispatch(setPID(result.result.PID));
                    dispatch(setDemographicsData(result.result));
                } else {
                    dispatch(setMessage({ success: false, message: "Ooops ! There is some issue with link." }));
                }
            } else {
                dispatch(setMessage({ success: false, message: result.message }));
            }
        });
    }
}

export const checkUserQuotaAction = (body) => {
    return dispatch => {
        dispatch(startSpinner());
        checkUserQuota(body).then((result) => {
            dispatch(endSpinner());
            if (result.success) {
                if (result.result.responseType === "MESSAGE") {
                    dispatch(setMessage({ success: false, message: result.result.message }));
                } else if (result.result.responseType === "REDIRECT") {
                    dispatch(setPID(result.result.PID));
                    dispatch(startSpinner());
                    window.location.href = result.result.redirectURL;
                }  else if (result.result.responseType === "DEMO_ALLOWED") {
                    dispatch(setPID(result.result.PID));
                    dispatch(setDemographicsData(result.result));
                } else {
                    dispatch(setMessage({ success: false, message: "Ooops ! There is some issue with link." }));
                }
            } else {
                dispatch(setMessage({ success: false, message: result.message }));
            }
        });
    }
}

export const fetchWelcomeMessageAction = () => {
    return dispatch => {
        dispatch(setWelcomeMessageSuccess(false))
        dispatch(startSpinner());
        /*welcomeMessage().then(result => {
            dispatch(endSpinner());
            if (result.success && result.result.data) {
                const isVisible = result.result.data.isVisible || 0;
                dispatch(setWelcomeMessageData(result.result.data));
                dispatch(setWelcomeVisibility(isVisible))
                dispatch(setWelcomeMessageSuccess(true));
            } else {
                dispatch(setWelcomeVisibility(0))
                dispatch(setWelcomeMessageSuccess(true));
            }
        }).catch(err => {
            dispatch(endSpinner());
            dispatch(setWelcomeVisibility(0))
            dispatch(setWelcomeMessageSuccess(true));
        });*/
        dispatch(endSpinner());
        dispatch(setWelcomeVisibility(0))
        dispatch(setWelcomeMessageSuccess(true));
    };
};
export const logAttentionCheckResponse = (body) => {
    return dispatch => {
        //dispatch(startSpinner());
        logAttentionCheck(body).then((result) => {
            //dispatch(endSpinner());
        });
    }
}

export default participantSlice.reducer;



export const updateParticipantFromClientAction = (allQueryParams, landingURL, userStatus) => {
    return async (dispatch) => {
        try {
            const result = await updateParticipantFromClient(allQueryParams, landingURL, userStatus);
            if (result.success) {
                if (result.result.responseType === "MESSAGE") {
                    return { type: 'MESSAGE', success: false, message: result.result.message };
                } else if (result.result.responseType === "REDIRECT") {
                    return { type: 'REDIRECT', redirectURL: result.result.redirectURL, isOpenNewTab: result.result.isOpenNewTab, isNewTabRedirect: result.result.isNewTabRedirect };
                } else {
                    return { type: 'MESSAGE', success: false, message: "Ooops ! There is some issue with link." };
                }
            } else {
                return { type: 'MESSAGE', success: false, message: result.message };
            }
        } catch (error) {
            return { type: 'MESSAGE', success: false, message: error.message || "An error occurred" };
        }
    };
};

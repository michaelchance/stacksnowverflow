export const API_REQUEST = "API_REQUEST";
export const API_RESPONSE = "API_RESPONSE";
export const API_ERROR = "API_ERROR";

//Require redux-thunk middleware
export function loadDataFromApi(options){
	const {endpoint, expiresMinutes} = options
	const {datapointer=endpoint, forceExpire, auth} = options
	return (dispatch, getState) => {
		const data = getState().data[datapointer]
		const access_token = getState().user.access_token;
		if(auth && !access_token){
			return null;
			}
		if(data && typeof data.expires !== "undefined" && !forceExpire && data.expires > new Date().getTime()){
			return null;
			}
		else if(data && data.IS_LOADING){
			return null;
			}
		else if(data && data.error_id){
			console.warn(data);
			return null;
			}
		else {
			return dispatch({
				type : API_REQUEST,
				endpoint,
				expiresMinutes,
				datapointer,
				auth
				});			
			}
		}
	}
	
export const AUTH_REQUEST = "AUTH_REQUEST";
export const AUTH_COMPLETE = "AUTH_COMPLETE";
export const AUTH_ERROR = "AUTH_ERROR";


export function login(){
	return {type:AUTH_REQUEST}
	}

export const LOGOUT = "LOGOUT";

export function logout(){
	return {type:LOGOUT}
	}

export const EXPIRE_DATA = "EXPIRE_DATA";

export function expireData(options){
	const {datapointer} = options;
	return {
		type:EXPIRE_DATA,
		datapointer
		};
	}
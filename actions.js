export const API_REQUEST = "API_REQUEST";
export const API_RESPONSE = "API_RESPONSE";
export const API_ERROR = "API_ERROR";

//Require redux-thunk middleware
export function loadDataFromApi(options){
	console.log('Loading Data from Api');
	const {endpoint, expiresMinutes} = options
	const {datapointer=endpoint, forceExpire, auth} = options
	return (dispatch, getState) => {
		const data = getState().data[datapointer]
		const access_token = getState().user.access_token;
		if(auth && !access_token){
			// console.log('auth required, but no access_token');
			return null;
			}
		if(data && typeof data.expires !== "undefined" && !forceExpire && data.expires > new Date().getTime()){
			// console.log('data not yet expired');
			return null;
			}
		else if(data && data.IS_LOADING){
			// console.log('data is already loading');
			return null;
			}
		else if(data && data.error_id){
			// console.warn(data);
			return null;
			}
		else {
			// console.log('returning dispatch');
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
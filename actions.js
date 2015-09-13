

export const API_REQUEST = "API_REQUEST";
export const API_RESPONSE = "API_RESPONSE";
export const API_ERROR = "API_ERROR";

//Require redux-thunk middleware
export function loadDataFromApi(options){
	const {endpoint, expiresMinutes} = options
	const {datapointer=endpoint, forceExpire} = options
	return (dispatch, getState) => {
		const data = getState().data[datapointer]
		if(data && typeof data.expires !== "undefined" && !forceExpire && data.expires > new Date().getTime()){
			return null;
			}
		else if(data && data.error_id){
			console.warn(data);
			return null;
			}
		else if(data && data.IS_LOADING){
			return null;
			}
		else {
			return dispatch({
				type : API_REQUEST,
				endpoint,
				expiresMinutes,
				datapointer
				});			
			}
		}
	}
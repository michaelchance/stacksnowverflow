import 'isomorphic-fetch';
import * as ActionTypes from './actions.js';

const API_ROOT = 'https://api.stackexchange.com/';

export default store => next => action => {
	if(action.type !== ActionTypes.API_REQUEST){
		return next(action);
		}
	else { 
		//assert(action.type === ActionTypes.API_REQUEST);
		let {endpoint} = action;
		if(typeof endpoint !== 'string'){
			throw new Error('API request endpoint must be a string');
			}
		
		next(action);

		const {expiresMinutes,datapointer} = action;
		
		let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

		if(fullUrl.indexOf('?') >= 0){fullUrl += "&";}
		else {fullUrl += "?";}
		
		fullUrl += "site=www.stackoverflow.com";
		
		const {access_token} = store.getState();
		if(access_token){ fullurl += "&access_token="+access_token; }

		return fetch(fullUrl)
			.then(response =>
				response.json().then(json => ({json,response}))
				)
			.then(({json,response}) => {
				// if(json.hasError)
				if(json.error_id){
					return Promise.reject(json);
					}
				return json
				})
			.then(
				response => next({type:ActionTypes.API_RESPONSE, endpoint, response, expiresMinutes, datapointer}),
				error => next({type:ActionTypes.API_ERROR, endpoint, error, datapointer})
				);
		}
	}
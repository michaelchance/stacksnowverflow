import * as ActionTypes from './actions.js';
import {combineReducers} from 'redux';

function data(state={}, action){
	const {type} = action;
	if(type === ActionTypes.EXPIRE_DATA ||
		type === ActionTypes.AUTH_COMPLETE ||
		type === ActionTypes.LOGOUT){
		
		merge = Object.assign({},state);
		Object.getOwnPropertyNames(merge).forEach(function(val, idx, array) {
			if(merge[val].auth){
				delete merge[val]
				delete state[val]
				}
			else {
				merge[val].expires = 0;
				}
			});
		return Object.assign({},state,merge);
		}
	else if(type === ActionTypes.API_REQUEST){
		const {endpoint} = action;
		const { datapointer=endpoint } = action;
		return Object.assign({},state,{[datapointer]:{IS_LOADING:true}});
		}
	else if(type === ActionTypes.API_RESPONSE || type === ActionTypes.API_ERROR){
		const {endpoint} = action;
		const { expiresMinutes = 60, datapointer=endpoint} = action;
		if(type === ActionTypes.API_ERROR){
			let {error} = action;
			error.expires = 0; //auto expire an error'd request, but put it in the state for display purposes
			return Object.assign({},state,{[datapointer]:error});
			}
		else {
			let {response} = action;
			response.expires = new Date().getTime() + expiresMinutes*60*1000;
			return Object.assign({},state,{[datapointer]:response});
			}
		}
	return state;
	}

function user(state={}, action){
	const {type} = action;
	if(type === ActionTypes.AUTH_REQUEST){
		return {};
		}
	else if(type === ActionTypes.AUTH_COMPLETE){
		const access_token = action.accessToken;
		return {access_token};
		}
	else if(type === ActionTypes.LOGOUT || type === ActionTypes.AUTH_ERROR){
		return {};
		}
	return state;
	}

function version(state="0",action){
	return state;
	}

const rootReducer = combineReducers({
	data,
	user,
	version
	});

export default rootReducer;
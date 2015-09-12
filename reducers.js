import * as ActionTypes from './actions.js';
import {combineReducers} from 'redux';

function data(state={}, action){
	const {type} = action;
	if(type === ActionTypes.API_REQUEST){
		const {endpoint} = action;
		const { datapointer=endpoint } = action;
		return Object.assign({},state,{[datapointer]:{IS_LOADING:true}});
		}
	if(type === ActionTypes.API_RESPONSE || type === ActionTypes.API_ERROR){
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

const rootReducer = combineReducers({
	data
	});

export default rootReducer;
import 'isomorphic-fetch';
import * as ActionTypes from './actions.js';

const API_ROOT = 'https://api.stackexchange.com/';

var clientId = 5539;
var key = 'hZ9sd3aziJ8Jx6BTf)ltxA((';
var channelUrl = 'http://michaelchance.github.io/stacksnowverflow/blank.html';
if(window.location.hostname == 'localhost'){
	clientId = 5540;
	key = '*ECQ1vskbGqWbv9V2c*miA((';
	channelUrl = 'http://localhost:3000/blank.html';
	}

var initPromise = new Promise((resolve,reject)=>{
	window.SE.init({
		clientId: clientId,
		key:key,
		channelUrl:channelUrl,
		complete:function(data){
			resolve(data);
			}
		});
	});
	


//		document.getElementById('login').addEventListener('click',function(){
//			SE.authenticate({
//				success: function(data){ console.log('success'); console.log(data); },
//				error: function(data){ console.log('failure'); console.log(data); },
//				networkUsers: true
//				});
//			});

export default store => next => action => {
	if(action.type === ActionTypes.AUTH_REQUEST){
		return initPromise.then(()=>{
				return new Promise((resolve,reject)=>{
					SE.authenticate({
						success : function(data){resolve(data);},
						error : function(data){reject(data);}
						});
					})
				})
			.then(
				response => {
					response.type = ActionTypes.AUTH_COMPLETE;
					return next(response);
					},
				error => {
					error.type = ActionTypes.AUTH_ERROR;
					return next(error);
					}
				);
		}
	else if(action.type === ActionTypes.API_REQUEST){ 
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
		if(access_token){ fullUrl += "&access_token="+access_token; }
		
		fullUrl += "&key="+key;
		
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
	else {
		return next(action);
		}
	}
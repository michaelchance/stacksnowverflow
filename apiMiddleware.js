// Borrowed from http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest
// Then modified to provide requests of any HTTP method
function http(method, url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open(method, url);

    req.onload = function() {
		//resolve with any status code
		resolve(req.response);
      // This is called even on 404 etc
      // so check the status
      // if (req.status == 200) {
        // Resolve the promise with the response text
      // }
      // else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        // reject(Error(req.statusText));
      // }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

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

		const {expiresMinutes,datapointer,auth,nosite} = action;
		
		if(endpoint.indexOf('/') == 0){
			endpoint = endpoint.substr(1);
			}
		
		let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

		if(fullUrl.indexOf('?') >= 0){fullUrl += "&";}
		else {fullUrl += "?";}
		fullUrl += "key="+key;
		
		if(!nosite){
			fullUrl += "&site=www.stackoverflow.com";
			}
		
		const {access_token} = store.getState().user;
		if(access_token){ fullUrl += "&access_token="+access_token; }
		
		
		var xhr = new XMLHttpRequest();
		const {method='GET'} = action;
		return http(method,fullUrl)
			.then(response => {
				// console.log('Response!');
				// console.log(response);
				try{
					const json = JSON.parse(response);
					// console.log('returning JSON');
					return json;
					}
				catch(e){
					return Promise.reject({error:response});
					}
				})
			.then(json => {
				// if(json.hasError)
				if(json.error_id){
					return Promise.reject(json);
					}
				// console.log('no error detected');
				return json
				})
			.then(
				response => next({type:ActionTypes.API_RESPONSE, endpoint, response, expiresMinutes, datapointer, auth}),
				error => next({type:ActionTypes.API_ERROR, endpoint, error, datapointer, auth})
				);
		}
	else {
		return next(action);
		}
	}
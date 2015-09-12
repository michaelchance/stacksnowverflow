require('babel-core/polyfill');

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from './apiMiddleware.js';
import loggerMiddleware from 'redux-logger';
import rootReducer from './reducers.js';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
// import HashHistory from 'react-router/lib/HashHistory';

import App from './pages/app.js';
import SearchPage from './pages/search.js';

// const history = new HashHistory();
const initialState = {};

const store = applyMiddleware(
	thunkMiddleware,
	apiMiddleware,
	loggerMiddleware
	)(createStore)(rootReducer, initialState);

var root = document.getElementById('root');

React.render(
	<Provider store={store}>
		{()=>
			<Router history={createHashHistory()}>
				<Route path="/" component={App}>
					<Route path="/search" component={SearchPage}/>
				</Route>
			</Router>
		}
	</Provider>,
	document.getElementById('root'));
/*
					<Route path="/question/:id" component={QuestionPage}/>
					<Route path="/profile" component={ProfilePage}/>
					<Route path="/profile/badges" component={ProfileBadgesPage}/>
					<Route path="/profile/favorites" component={ProfileFavoritesPage}/>
					<Route path="/profile/answers" component={ProfileAnswersPage}/>
*/
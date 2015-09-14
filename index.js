require('babel-core/polyfill');

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import apiMiddleware from './apiMiddleware.js';
import loggerMiddleware from 'redux-logger';
import rootReducer from './reducers.js';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
// import HashHistory from 'react-router/lib/HashHistory';

import App from './pages/app.js';
import HomePage from './pages/home.js';
import SearchPage from './pages/search.js';
import QuestionPage from './pages/question.js';
import TagListingPage from './pages/taglisting.js';
import TagDetailPage from './pages/tagdetail.js';

import ProfileContainer from './pages/profilecontainer.js';
import ProfilePage from './pages/profile.js';
import ProfileFavoritesPage from './pages/favorites.js';
import ProfileAnswersPage from './pages/answers.js';

// const history = new HashHistory();
const initialState = {version:"201509141044"};

const store = applyMiddleware(
	thunkMiddleware,
	apiMiddleware,
	loggerMiddleware
	)(createStore)(rootReducer, initialState);

React.render(
	<Provider store={store}>
		{()=>
			<Router history={createHashHistory()}>
				<Route path="/" component={App}>
					<IndexRoute component={HomePage}/>
					<Route path="/search" component={SearchPage}/>
					<Route path="/question/:id" component={QuestionPage}/>
					<Route path="/tags" component={TagListingPage}/>
					<Route path="/tags/:tag" component={TagDetailPage}/>
					<Route path="/profile" component={ProfileContainer}>
						<IndexRoute component={ProfilePage}/>
						<Route path="favorites" component={ProfileFavoritesPage}/>
						<Route path="answers" component={ProfileAnswersPage}/>
					</Route>
				</Route>
			</Router>
		}
	</Provider>,
	document.getElementById('root'));
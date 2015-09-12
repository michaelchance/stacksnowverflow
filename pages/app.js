import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {History} from 'react-router';
console.log(History);
import {loadDataFromApi} from '../actions.js';

var App = React.createClass({
	
	mixins : [History],
	loadData(props){
		props.loadDataFromApi({endpoint:'questions'});
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
		
	execSearch(){
		console.log('EXEC SEARCH '+findDOMNode(this.refs.search).value);
		console.log(this);
		// this.context.router.transitionTo('/search?q='+findDOMNode(this.refs.search).value);
		this.history.pushState({},'/search?q='+findDOMNode(this.refs.search).value);
		},	
		
	render (){
		const {location,children} = this.props;
		console.log(location);
		console.log(children);
		return (
			<div>
				<div className="header">
					<div className="contentContainer">
						<h1>Hello World { get(this.props, 'data.items[0].title') }</h1>
						<form onSubmit={this.execSearch}>
							<input ref="search"/>
							<button>Go!</button>
						</form>
					</div>
				</div>
				<div className="contentBody">
					<div className="contentContainer">
						{children}
					</div>
				</div>
				<div className="footer">
					<div className="contentContainer">
					
					</div>
				</div>
			</div>
			);
		},
	});

// class App extends Component {
	// constructor(props){
		// super(props);
		// this.execSearch = this.execSearch.bind(this);
		// }
	// }

// App.contextTypes = {
	// router : PropTypes.object.isRequired
// }

export default connect(
	function(state){ return {
		data : state.data.questions
		}; },
	{ loadDataFromApi }
	)(App);
	

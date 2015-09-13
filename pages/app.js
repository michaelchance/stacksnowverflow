import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link, IndexLink, History} from 'react-router';
console.log(History);
import {loadDataFromApi} from '../actions.js';

var App = React.createClass({
	
	mixins : [History],
	loadData(props){
		//props.loadDataFromApi({endpoint:'questions'});
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
		
	execSearch(){
		this.history.pushState({},'/search?q='+encodeURIComponent(findDOMNode(this.refs.headerSearchInput).value));
		findDOMNode(this.refs.headerSearchInput).value = "";
		// console.log(findDOMNode(this.refs.headerSearchInput));
		findDOMNode(this.refs.headerSearchInput).blur();
		},	
		
	render (){
		const {location,children} = this.props;
		return (
			<div>
				<div className="navBar">
					<div className="contentContainer">
					
					</div>
				</div>
				<div id="header">
					<div className="contentContainer">
						<form id="headerSearch" onSubmit={this.execSearch}>
							<input id="headerSearchInput" placeholder="Search Stack Snowverflow" ref="headerSearchInput"/>
							<input id="headerSearchSubmit" type="submit" value="" title="Search Stack Snowverflow"/>
						</form>
						<div>
							<h1 id="logo"><a href="http://us.battle.net/"></a></h1>
							<h2 id="logoSubtitle"><Link onlyActiveOnIndex={true} to="/">Stack Snowverflow</Link></h2>
						</div>
						<div id="headerNavBar">
							<Link activeClassName="active" onlyActiveOnIndex={true} to="/">Home<span className="indicator"/></Link>
							<Link activeClassName="active" to="/search">Search<span className="indicator"/></Link>
							<Link activeClassName="active" to="/tags">Tags<span className="indicator"/></Link>
						</div>
					</div>
					<div className="clear"/>
				</div>
				<div id="contentBody">
					<div className="contentContainer">
						{children}
					</div>
				</div>
				<div id="footer">
					<div className="contentContainer">
					
					</div>
				</div>
			</div>
			);
/*
							<Link activeClassName="active" to="/profile">My Profile<span className="indicator"/></Link>
*/							
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
		//data : state.data.questions
		}; },
	{ loadDataFromApi }
	)(App);
	


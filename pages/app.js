import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link, IndexLink, History} from 'react-router';
console.log(History);
import {loadDataFromApi,logout,login} from '../actions.js';

var App = React.createClass({
	
	mixins : [History],
	loadData(props){
		props.loadDataFromApi({
			endpoint:"me",
			auth:true
			})
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

	login(){
		this.props.login();
		return false;
		},
	logout(){
		this.props.logout();
		return false;
		},
	
	render (){
		const {children} = this.props;
		return (
			<div>
				<div id="navBar">
					<div className="contentContainer">
						{()=>{
							if(this.props.me){
								return (
									<span className="floatRight">
										<Link to="/profile">{this.props.me.display_name}</Link>
										<Link to="/" onClick={this.logout}>Log Out</Link>
									</span>
									);
								}
							else{
								return (
									<span className="floatRight">
										<Link to="/" onClick={this.login}>Log In</Link>
									</span>
									);
								}
							}()}
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
							{ this.props.me ? 
								(<Link activeClassName="active" to="/profile">Profile<span className="indicator"/></Link>)
								: ""}
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
					{this.props.version}
					</div>
				</div>
			</div>
			);
/*
							<Link activeClassName="active" to="/profile">My Profile<span className="indicator"/></Link>
*/							
		},
	});


export default connect(
	function(state){ 
		const {version} = state;
		const {access_token} = state.user;
		const {me} = state.data;
		let r = {
			version,
			access_token
			};
		if(me && me.items && me.items.length > 0){
			r.me = me.items[0]
			}
		return r;
		},
	{ loadDataFromApi,login,logout }
	)(App);
	


import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

import QuestionListItem from '../components/questionlistitem.js';

var HomePage = React.createClass({
	mixins : [History],
	loadData(props,forceExpire){
		props.loadDataFromApi({endpoint:'questions?sort=hot',datapointer:"hotQuestions"});
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	execSearch(){
		console.log('home exec search');
		this.history.pushState({},'/search?q='+encodeURIComponent(findDOMNode(this.refs.homeSearchInput).value));
		// findDOMNode(this.refs.homeSearchInput).value = "";
		// console.log(findDOMNode(this.refs.headerSearchInput));
		// findDOMNode(this.refs.homeSearchInput).blur();
		},
	render (){
		return (
			<div id="homePage">
				<form id="homeSearchForm" className="searchForm" onSubmit={this.execSearch}>
					<h2 className="heading">Search for Questions</h2>
					<div id="homeSearchContainer">
						<input type="text" className="search" placeholder="Search Stack Snowverflow" ref="homeSearchInput"/>
						<input type="submit" className="submit" value="SEARCH"/>
					</div>
				</form>
				<div>
					<h2 className="heading flame">Hottest Questions</h2>
					<div>{()=>{
						if(this.props.hot && this.props.hot.length){
							return this.props.hot.map(q=>{
								return (<QuestionListItem {...q}/>);
								});
							}
						else {}
						}()}
						
					</div>
				</div>
			</div>
			);
		}
	});

// class HomePage extends Component {
	// constructor(props){
		// super(props);
		// this.state = {sort:"relevance"}
		// }
		
	// }

// HomePage.contextTypes = {
	// router : PropTypes.object.isRequired
// }

export default connect(
	function(state, ownProps){
		var hot = [];
		if(state.data["hotQuestions"] && state.data["hotQuestions"].items){
			hot = state.data["hotQuestions"].items;
			}
		return {hot} 
		},
	{ loadDataFromApi }
	)(HomePage);
	


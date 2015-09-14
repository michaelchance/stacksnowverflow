import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

import QuestionListItem from '../components/questionlistitem.js';

var SearchPage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		console.log('SEARCH LOADDATA '+this.state.page);
		let q = get(props, "location.query.q");
		let sort = get(props, "location.query.sort") || "relevance";
		if(q){
			q = encodeURIComponent(q);
			sort = encodeURIComponent(sort);
			console.log('Q');
			console.log(q);
			if(this.refs && this.refs.q){
				findDOMNode(this.refs.q).value = q;
				}
			if(!this.state.q){ this.setState({q}); }
			else if(this.state.q != q) { this.setState({q, page:1}); }
			setTimeout(()=>{
				for(let i = 1; i <= this.state.page; i++){
					props.loadDataFromApi({
						endpoint:`/search/advanced?q=${q}&sort=${sort}&page=${i}`,
						forceExpire
						});
					}
				},0);
			}
		//props.loadDataFromApi('questions');
		},
	componentWillMount(){
		console.log('SEARCH WILLMOUNT');
		this.setState({page:1});
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		console.log('SEARCH WILLRECEIVEPROPS');
		this.loadData(nextProps);
		},
	setSort(){
		let q = get(this.props,"location.query.q");
		const sort = encodeURIComponent(findDOMNode(this.refs.sort).value);
		if(q){
			q = encodeURIComponent(q);
			this.history.pushState({},`/search?q=${q}&sort=${sort}`);
			}
		else {
			this.history.pushState({},`/search?sort=${sort}`);
			}
		},
	execSearch(){
		let q = findDOMNode(this.refs.q).value;
		let sort = get(this.props, "location.query.sort") || "relevance";
		if(q){
			q = encodeURIComponent(q);
			sort = encodeURIComponent(sort);
			this.setState({page:1});
			this.history.pushState({},`/search?q=${q}&sort=${sort}`);
			}
		},
	increasePage(){
		console.log('setting page');
		const n = {
			page:this.state.page+1
			}
		console.log(n);
		this.setState(n);
		this.loadData(this.props);
		},
	render (){
		return (
			<div id="searchPage">
				<form onSubmit={this.execSearch} className="searchForm">
					<input className="search"
						placeholder="Search for Questions"
						type="text" 
						ref="q" 
						defaultValue={get(this.props,"location.query.q") ? get(this.props,"location.query.q") : ""}/>
					<input type="submit" className="submit" value="Search"/>
					<span>
						<label>Sorted By:</label>
						<select ref="sort" defaultValue={get(this.props,"location.query.sort") ? get(this.props,"location.query.sort") : "relevance"} onChange={this.setSort}>
							<option value="relevance">Relevance</option>
							<option value="activity">Activity</option>
							<option value="creation">Creation Date</option>
							<option value="votes">Score</option>
						</select>
					</span>
				</form>
				<div>
					{()=>{
						const items = get(this.props, 'items');
						if(items){
							return items.map(q=>{
								return (<QuestionListItem {...q}/>);
								});
							}
						else if(get(this.props,"location.query.q")){
							return "Loading...";
							}
						else{
							return "Get searching!"
							}
					}()}
				</div>
				<div className="alignRight">
					{() => {
						if(this.props.has_more){
							return (
								<button className="blueButton" onClick={this.increasePage}>Load More...</button>
								)
							}
						}()}
				</div>
			</div>
			);
		}
	});

// class SearchPage extends Component {
	// constructor(props){
		// super(props);
		// this.state = {sort:"relevance"}
		// }
		
	// }

// SearchPage.contextTypes = {
	// router : PropTypes.object.isRequired
// }

export default connect(
	function(state, ownProps){
		let q = get(ownProps, "location.query.q");
		let sort = get(ownProps, "location.query.sort") || "relevance";
		if(q){
			q = encodeURIComponent(q);
			sort = encodeURIComponent(sort);
			let r = {items:[]}
			let i = 1;
			while(state.data[`/search/advanced?q=${q}&sort=${sort}&page=${i}`]){
				const data = state.data[`/search/advanced?q=${q}&sort=${sort}&page=${i}`];
				if(data.items){
					data.items.map(item =>{
						r.items.push(item);
						});
					r.has_more = data.has_more;
					}
				i++;
				}
			return r;
			}
		return {};
		},
	{ loadDataFromApi }
	)(SearchPage);
	


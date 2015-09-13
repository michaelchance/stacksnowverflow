import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {loadDataFromApi} from '../actions.js';

var SearchPage = React.createClass({
	getInitialState(){
		return {sort:"relevance"}
		},
	setSort(){
		const sort = findDOMNode(this.refs.sort).value
		this.setState({sort});
		this.loadData(this.props, true);
		},
	loadData(props,forceExpire){
		console.log('SEARCH LOADDATA');
		const q = encodeURIComponent(get(props, "location.query.q"));
		const {sort} = this.state;
		if(q){
			props.loadDataFromApi({
				endpoint:'search/advanced?q='+q+"&sort="+sort,
				datapointer : "search|"+q, //add the "from"
				forceExpire
				});
			}
		//props.loadDataFromApi('questions');
		},
	componentWillMount(){
		console.log('SEARCH WILLMOUNT');
		this.loadData(this.props);
		},
	
	onEnter(){
		console.log('SEARCH ONENTER');
		},
	renderItem(itemObj){
		return (
			<h1><Link to="/question"{itemObj.title}</h1>
			)
		},
	componentWillReceiveProps(nextProps){
		console.log('SEARCH WILLRECEIVEPROPS');
		this.loadData(nextProps);
		},
	render (){
		return (
			<div>
				<h1>Hello Search</h1>
				<select ref="sort" value={this.state.sort} onChange={this.setSort}>
					<option value="relevance">Relevance</option>
					<option value="activity">Activity</option>
					<option value="creation">Creation Date</option>
					<option value="votes">Score</option>
				</select>
				<div>
					{()=>{
						const items = get(this.props, 'items');
						if(items){
							return items.map(this.renderItem);
							}
						else {
							return "Loading...";
							}
					}}
				</div>
				<div>{JSON.stringify(this.props.data)}</div>
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

SearchPage.contextTypes = {
	router : PropTypes.object.isRequired
}

export default connect(
	function(state, ownProps){
		const q = encodeURIComponent(get(ownProps, "location.query.q"));
		if(q){
			return {
				data : state.data['search|'+ownProps.location.query.q]
				}; 
			}
		return {};
		},
	{ loadDataFromApi }
	)(SearchPage);
	


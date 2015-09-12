import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {loadDataFromApi} from '../actions.js';

class SearchPage extends Component {
	constructor(props){
		super(props);
		this.state = {sort:"relevance"}
		}
		
	setSort(sort){
		this.setState({sort});
		}
	loadData(props){
		const q = encodeURIComponent(get(props, "location.query.q"));
		if(q){
			props.loadDataFromApi({
				endpoint:'search/advanced?q='+q,
				datapointer : "search|"+q //add the "from"
				});
			}
		//props.loadDataFromApi('questions');
		}
	componentWillMount(){
		console.log('SEARCH WILLMOUNT');
		this.loadData(this.props);
		}
	
	onEnter(){
		console.log('SEARCH ONENTER');
		}
		
	componentWillReceiveProps(nextProps){
		console.log('SEARCH WILLRECEIVEPROPS');
		this.loadData(nextProps);
		}
	render (){
		return (
			<div>
				<h1>Hello Search</h1>
				<select ref="sort">
					<option selected value="relevance">Relevance</option>
					<option selected value="activity">Activity</option>
					<option selected value="creation"></option>
					<option selected value="votes">Score</option>
				</select>
				<div>{JSON.stringify(this.props.data)}</div>
			</div>
			);
		}
	}

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
	


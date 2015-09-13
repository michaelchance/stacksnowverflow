import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {loadDataFromApi} from '../actions.js';

var QuestionPage = React.createClass({
	getInitialState(){
		return {sort:"relevance"}
		},
	setSort(){
		const sort = findDOMNode(this.refs.sort).value
		this.setState({sort});
		this.loadData(this.props, true);
		},
	loadData(props){
		// console.log('QUESTION LOADDATA');
		const id = encodeURIComponent(get(props, "params.id"));
		if(id){
			props.loadDataFromApi({
				endpoint:'questions/'+id,
				});
			}
		//props.loadDataFromApi('questions');
		},
	componentWillMount(){
		// console.log('SEARCH WILLMOUNT');
		this.loadData(this.props);
		},
	
	onEnter(){
		// console.log('SEARCH ONENTER');
		},
	componentWillReceiveProps(nextProps){
		// console.log('SEARCH WILLRECEIVEPROPS');
		this.loadData(nextProps);
		},
	render (){
		return (
			<div>
				<div>{JSON.stringify(this.props.data)}</div>
			</div>
			);
		}
	});

// class QuestionPage extends Component {
	// constructor(props){
		// super(props);
		// this.state = {sort:"relevance"}
		// }
		
	// }

// QuestionPage.contextTypes = {
	// router : PropTypes.object.isRequired
// }

export default connect(
	function(state, ownProps){
		const id = encodeURIComponent(get(ownProps, "params.id"));
		if(id){
			return {
				data : state.data['questions/'+id]
				}; 
			}
		return {};
		},
	{ loadDataFromApi }
	)(QuestionPage);
	


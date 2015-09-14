import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var ProfileBadgesPage = React.createClass({
	mixins : [History],
	loadData(props,forceExpire){
		props.loadDataFromApi({
			endpoint : "users/838992/badges",
			datapointer : "me|badges"
			});
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	render (){
		return (
			<div>
			</div>
			);
		}
	});

export default connect(
	function(state, ownProps){
		return {};
		},
	{ loadDataFromApi }
	)(ProfileBadgesPage);
	


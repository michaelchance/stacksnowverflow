import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var ProfileContainer = React.createClass({
	mixins : [History],
	loadData(props,forceExpire){
		props.loadDataFromApi({
			endpoint : 'filter/create?include=user.about_me;user.answer_count;user.view_count',
			datapointer : 'userfilter',
			nosite : true
			});
		const {userfilter} = props;
		if(userfilter){
			props.loadDataFromApi({
				endpoint : `me?filter=${userfilter}`,
				datapointer : "me|profile"
				});
			}
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	render (){
		const {children} = this.props;
		return (
			<div>
				<div id="profileLinks" className="alignRight">
					<Link className="profileLink" activeClassName="active" onlyActiveOnIndex={true} to="/profile" className="profileLink">My Profile</Link>
					<Link className="profileLink" activeClassName="active" to="/profile/favorites" className="profileLink">My Favorites</Link>
					<Link className="profileLink" activeClassName="active" to="/profile/answers" className="profileLink">My Answers</Link>
				</div>
				{children}
			</div>
			);
		}
	});

export default connect(
	function(state, ownProps){
		return {
			userfilter : get(state, "data.userfilter.items[0].filter")
			}
		},
	{ loadDataFromApi }
	)(ProfileContainer);
	


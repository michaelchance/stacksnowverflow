import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var ProfilePage = React.createClass({
	mixins : [History],
	loadData(props,forceExpire){
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	render (){
		console.log(this.props);
		return (
			<div>
				<h2 className="heading">{get(this.props, "me.display_name")}</h2>
				<div id="portraitBox" className="floatLeft">
					<img width="164" height="164" src={get(this.props, "me.profile_image")}/>
					<div id="portraitBadges" className="alignCenter">
						<span className="badgeCountContainer gold">
							<span className="badgeIcon" />
							<span className="badgeCount">
								{get(this.props, "me.badge_counts.gold",0)}
							</span>
						</span>
						<span className="badgeCountContainer silver">
							<span className="badgeIcon" />
							<span className="badgeCount">
								{get(this.props, "me.badge_counts.silver",0)}
							</span>
						</span>
						<span className="badgeCountContainer bronze">
							<span className="badgeIcon" />
							<span className="badgeCount">
								{get(this.props, "me.badge_counts.bronze",0)}
							</span>
						</span>
					</div>
				</div>
				<div id="profileStats" className="floatRight">
					<div>
						<div className="displayInlineBlock">
							<div>{get(this.props, "me.reputation")}</div>
							<div>reputation</div>
						</div>
						<div className="displayInlineBlock">
							<div>{get(this.props, "me.answer_count")}</div>
							<div>answers</div>
						</div>
					</div>
					<div>
						<div className="profileInfoLine">
							<span className="sprite displayInlineBlock location" />
							<span>{get(this.props,"me.location")}</span>
						</div>
						<div className="profileInfoLine">
							<span className="sprite displayInlineBlock link" />
							<a href={get(this.props,"me.website_url")}>My Website</a>
						</div>
						<div className="profileInfoLine">
							<span className="sprite displayInlineBlock views" />
							<span>{get(this.props,"me.view_count")}</span>
						</div>
					</div>
				</div>
				<div dangerouslySetInnerHTML={()=>{return {__html:get(this.props,"me.about_me")};}()}/>
			</div>
			);
			/*
						<div className="profileInfoLine">
							<span className="sprite displayInlineBlock joined" />
							<span>{new Date(get(this.props,"me.creation_date")).toString()}</span>
						</div>
			
			*/
		}
	});

export default connect(
	function(state, ownProps){
		console.log(state);
		return {
			me : get(state, 'data["me|profile"].items[0]')
			};
		},
	{ loadDataFromApi }
	)(ProfilePage);
	


import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var ProfilePage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		props.loadDataFromApi({
			endpoint : 'filter/create?include=badge.description',
			datapointer : 'badgefilter',
			nosite : true
			});
		const {badgefilter} = props;
		if(badgefilter){
			setTimeout(()=>{
				for(let i = 1; i <= this.state.page; i++){
					props.loadDataFromApi({
						endpoint : `me/badges?page=${i}&filter=${badgefilter}`,
						datapointer : `me|badges|${i}`
						});
					}
				},0);
			}
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	increasePage(){
		// console.log('setting page');
		const n = {
			page:this.state.page+1
			}
		// console.log(n);
		this.setState(n);
		this.loadData(this.props);
		},
	render (){
		console.log(this.props);
		return (
			<div>
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
				<div className="clear">
					<h2 className="heading">Badges</h2>
					<div>
						{()=>{
							const badges = get(this.props, 'badges',[]);
							return badges.map(b=>{
								return (
									<div>
										<div className="displayInlineBlock badgePlateContainer alignRight">
											<div className={"displayInlineBlock badgePlate "+get(b,'rank')}>
												<span className="badgeName">{get(b,'name')}</span>
												<span className="badgeIcon"/>
											</div>
										</div>
										<div className="badgeDescription displayInlineBlock"
											dangerouslySetInnerHTML={()=>{return {__html:get(b,'description')};}()}/>
									</div>
									);
								});
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
		let r = {
			me : get(state, 'data["me|profile"].items[0]'),
			badges: [],
			badgefilter : get(state,'data.badgefilter.items[0].filter')
			};
		let i = 1;
		while(state.data[`me|badges|${i}`]){
			const data = state.data[`me|badges|${i}`];
			if(data.items){
				data.items.map(item=>{
					r.badges.push(item);
					});
				}
			r.has_more = data.has_more;
			i++;
			}
		return r;
		return {};
		},
	{ loadDataFromApi }
	)(ProfilePage);
	


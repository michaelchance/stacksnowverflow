import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var TagListingPage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		//in timeout to allow state to be set
		setTimeout(()=>{
			for(let i = 1; i <= this.state.page; i++){
				props.loadDataFromApi({
					endpoint : `tags?page=${i}&sort=popular&order=desc&pagesize=20`,
					datapointer : `tags?page=${i}`
					});
				}
			},0);
		for(let i = 1; i<= this.state.page; i++){
			if(props.tagPages && props.tagPages[i]){
				props.loadDataFromApi({
					endpoint : `tags/${props.tagPages[i]}/wikis`,
					datapointer : `tagWiki|${i}`
					});
				}
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
		return (
			<div>
				<h2 className="heading flame">Hottest Tags</h2>
				<div className="alignCenter">
					{get(this.props,'tags',[]).map(tag=>{
						return (
							<div className="tagListing alignLeft">
								<div>
									<Link className="tagLink" to={`/tags/${tag.name}`}>{tag.name}</Link>
									x <span>{tag.count}</span>
								</div>
								<div dangerouslySetInnerHTML={()=>{return {__html:tag.excerpt};}()}></div>
							</div>
							)
						})}
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

export default connect(
	function(state, ownProps){
		let r = {tagPages:[], tags:[]};
		let i = 1;
		let tagMap = {};
		while(state.data[`tags?page=${i}`]){
			const data = state.data[`tags?page=${i}`];
			let tags = [];
			if(data.items){
				data.items.map(item=>{
					r.tags.push(item);
					tagMap[item.name] = item;
					tags.push(encodeURIComponent(item.name));
					});
				r.tagPages[i] = tags.join(';');
				r.has_more = data.has_more;
				}
			i++;
			}
		i = 1;
		while(state.data[`tagWiki|${i}`]){
			const data = state.data[`tagWiki|${i}`];
			if(data.items){
				data.items.map(item=>{
					if(tagMap[item.tag_name]){
						tagMap[item.tag_name].excerpt = item.excerpt;
						}
					});
				}
			i++;
			}
		return r;
		},
	{ loadDataFromApi }
	)(TagListingPage);
	


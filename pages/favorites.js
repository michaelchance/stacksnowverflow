import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

import QuestionListItem from '../components/questionlistitem.js';

var ProfileFavoritesPage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		//in timeout to allow state to be set
		setTimeout(()=>{
			for(let i = 1; i <= this.state.page; i++){
				props.loadDataFromApi({
					endpoint : `me/favorites?page=${i}`,
					datapointer : `me|favorites|${i}`
					});
				}
			},0);
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
				<h2 className="heading">Favorites</h2>
				<div>
					{()=>{
						const favorites = get(this.props, 'favorites',[]);
						return favorites.map(f=>{
							return (<QuestionListItem {...f}/>);
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
			);
		}
	});

export default connect(
	function(state, ownProps){
		let r = {favorites:[]};
		let i = 1;
		while(state.data[`me|favorites|${i}`]){
			const data = state.data[`me|favorites|${i}`];
			if(data.items){
				data.items.map(item=>{
					r.favorites.push(item);
					});
				}
			r.has_more = data.has_more;
			i++;
			}
		return r;
		},
	{ loadDataFromApi }
	)(ProfileFavoritesPage);
	


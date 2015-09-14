import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

import QuestionListItem from '../components/questionlistitem.js';

var TagDetailPage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		const {tag} = props.params;
		if(tag){
			//in timeout to allow state to be set
			setTimeout(()=>{
				for(let i = 1; i <= this.state.page; i++){
					props.loadDataFromApi({
						endpoint:`/questions?tagged=${tag}&sort=hot&page=${i}`,
						datapointer:`questionsByTag|${tag}|${i}`,
						forceExpire
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
		return (
			<div>
				<h2 className="heading">Questions tagged {this.props.params.tag}</h2>
				<div>
					{()=>{
						const questions = get(this.props, 'questions');
						if(questions){
							return questions.map(q=>{
								return (<QuestionListItem {...q}/>);
								});
							}
						return "";
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
		const {tag} = ownProps.params;
		if(tag){
			let r={questions:[]}
			let i = 1;
			while(state.data[`questionsByTag|${tag}|${i}`]){
				const data = state.data[`questionsByTag|${tag}|${i}`];
				if(data.items){
					data.items.map(item=>{
						r.questions.push(item);
						});
					}
				r.has_more = data.has_more;
				i++;
				}
			return r;
			}
		return {};
		},
	{ loadDataFromApi }
	)(TagDetailPage);
	


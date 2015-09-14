import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import {loadDataFromApi} from '../actions.js';

var ProfileAnswersPage = React.createClass({
	getInitialState : function(){
		return {page:1};
		},
	mixins : [History],
	loadData(props,forceExpire){
		//in timeout to allow state to be set
		setTimeout(()=>{
			for(let i = 1; i <= this.state.page; i++){
				props.loadDataFromApi({
					endpoint : `me/answers?page=${i}&filter=withbody`,
					datapointer : `me|answers|${i}`
					});
				}
			},0);
		for(let i = 1; i <= this.state.page; i++){
			if(props.qPages && props.qPages[i]){
				props.loadDataFromApi({
					endpoint : `questions/${props.qPages[i]}?page=${i}&filter=withbody`,
					datapointer : `qDetail|${i}`
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
				<h2 className="heading">Answers</h2>
				<div>
					{()=>{
						const answers = get(this.props, 'answers',[]);
						return answers.map(a=>{
							return (
								<div className={"postBodyContainer "+a.className}>
									<h3 className="myAnswer heading" >
										<Link className="questionLink"
											to={'/question/'+get(a, 'question.question_id')}
											dangerouslySetInnerHTML={()=>{return {__html:get(a,'question.title')};}()}/>
									</h3>
									<div className="postScoring">
										<div className="score">{a.score}</div>
									</div>
									<div className="postBody" dangerouslySetInnerHTML={()=>{return {__html:get(a,'body')};}()}></div>
									<div className="tags">
										{get(a,'tags',[]).map(tag=>{
											return (
												<Link className="tagLink" to={`/tags/${tag}`}>{tag}</Link>
												)
											})}
									</div>
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
			);
		}
	});

export default connect(
	function(state, ownProps){
		let r = {answers:[], qPages:[]};
		let i = 1;
		let qidToAnswerMap = {};
		while(state.data[`me|answers|${i}`]){
			const data = state.data[`me|answers|${i}`];
			let questions = [];
			if(data.items){
				data.items.map(item=>{
					r.answers.push(item);
					qidToAnswerMap[item.question_id] = item;
					questions.push(item.question_id);
					});
				r.qPages[i] = questions.join(';');
				}
			r.has_more = data.has_more;
			i++;
			}
		i=1;
		while(state.data[`qDetail|${i}`]){
			const data = state.data[`qDetail|${i}`];
			if(data.items){
				data.items.map(item=>{
					if(qidToAnswerMap[item.question_id]){
						qidToAnswerMap[item.question_id].question = item;
						}
					});
				}
			i++;
			}
		return r;
		},
	{ loadDataFromApi }
	)(ProfileAnswersPage);
	


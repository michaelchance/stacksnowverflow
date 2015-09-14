import React, { Component, PropTypes, findDOMNode } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/object/get';

import {Link,History} from 'react-router';

import PostBody from '../components/postbody.js';

import {loadDataFromApi,expireData} from '../actions.js';

var QuestionPage = React.createClass({
	getInitialState : function(){
		return {};
		},
	mixins : [History],
	loadData(props,forceExpire){
		console.log(props);
		const {id} = props.params;
		if(id){
			console.log('loading data');
			console.log(`questions/${id}?filter=withbody`);
			console.log(`questions/${id}/answers?filter=withbody`);
			this.props.loadDataFromApi({
				endpoint:`questions/${id}?filter=withbody`,
				datapointer:`question|${id}`
				});
			this.props.loadDataFromApi({
				endpoint:`questions/${id}/answers?filter=withbody`,
				datapointer:`answers|${id}`
				});
			}
		},
	componentWillMount(){
		this.loadData(this.props);
		},
	componentWillReceiveProps(nextProps){
		this.loadData(nextProps);
		},
	interact(interaction, type, id){
		return ()=>{
			// console.log('INTERACTION');
			// console.log(interaction);
			// console.log(type);
			// console.log(id);
			let req = { 
				endpoint:`${type}/${id}/${interaction}?filter=default&preview=false`,
				datapointer:`${type}/${id}/${interaction}`,
				auth:true
				}
			if(interaction.indexOf('undo') >= 0){
				const i = interaction.split('/')[0]; // upvote/undo => upvote
				this.props.expireData(`${i}|${id}`);
				}
			else {
				req.datapointer = `${interaction}|${id}`;
				}
			// console.log(req);
			this.props.loadDataFromApi(req);
			return false;
			}
		},
	render (){
		return (
			<div id="questionPage">
				<div className="question borderBottom">
					<h3 className="borderBottom" dangerouslySetInnerHTML={()=>{return {__html:get(this.props,'question.title')};}()}></h3>
					<PostBody {...this.props.question} interact={this.interact} type="questions" id={get(this.props,'question.question_id')}/>
				</div>
				<div>
					<h3 className="borderBottom">{get(this.props, 'answers.length') >= 0 ? "Answers" : ""}</h3>
					<div>
					{() => {
						const answers = get(this.props, 'answers');
						if(answers){	
							return answers.map(answer =>{
								return (<PostBody className="answer borderBottom" {...answer} interact={this.interact} type="answers" id={get(answer,'answer_id')}/>);
								});
							}
						else {
							return "Loading...";
							}
						}()}
					</div>
				</div>
			</div>
			);
		}
	});

export default connect(
	function(state, ownProps){
		const {id} = ownProps.params
		if(id){
			let r = {
				question : get(state.data,`question|${id}.items[0]`),
				answers : get(state.data,`answers|${id}.items`)
				};
			if(r.question && r.question_id){
				r.question.upvote = get(state.data, `upvote|${r.question_id}`);
				r.question.downvote = get(state.data, `downvote|${r.question_id}`);
				r.question.favorite = get(state.data, `favorite|${r.question_id}`);
				}
			if(r.answers && r.answers.length){
				for(var i in r.answers){
					r.answers[i].upvote = get(state.data, `upvote|${r.answers[i].answer_id}`);
					r.answers[i].downvote = get(state.data, `downvote|${r.answers[i].answer_id}`);
					r.answers[i].favorite = get(state.data, `favorite|${r.answers[i].answer_id}`);
					}
				}
			return  r;
			}
		return {};
		},
	{ loadDataFromApi,expireData }
	)(QuestionPage);
	


import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import get from 'lodash/object/get';

export default class QuestionListItem extends Component {
	render() {
		return (
			<div className="questionListItem">
				<div className="questionStats">
					<div className="score">
						<div className="stat">{this.props.score}</div>
						<div className="title">score</div>
					</div>
					<div className="answers">
						<div className="stat">{this.props.answer_count}</div>
						<div className="title">answers</div>
					</div>
					<div className="views">
						<div className="stat">{this.props.view_count}</div>
						<div className="title">views</div>
					</div>
				</div>
				<div className="questionBody">
					<h3>
						<Link className="questionLink" to={`/question/${this.props.question_id}`} dangerouslySetInnerHTML={()=>{return {__html:this.props.title};}()}></Link>
					</h3>
					<div className="tags">
						<strong>Tags</strong>
						{get(this.props,'tags',[]).map(tag=>{
							return (
								<Link className="tagLink" to={`/tags/${tag}`}>{tag}</Link>
								)
							})}
					</div>
				</div>
			</div>
			);
		}
	}
	
QuestionListItem.propTypes = {
	
	}
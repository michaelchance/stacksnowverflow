import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class QuestionListItem extends Component {
	render() {
		return (
			<div className="questionListItem">
				<h3>
					<Link to={`/question/${this.props.question_id}`} dangerouslySetInnerHTML={()=>{return {__html:this.props.title};}()}></Link>
				</h3>
				<div>
					{this.props.tags.map(tag=>{
						return (
							<Link to={`/tags/${tag}`}>{tag}</Link>
							)
						})}
				</div>
			</div>
			);
		}
	}
	
QuestionListItem.propTypes = {
	
	}
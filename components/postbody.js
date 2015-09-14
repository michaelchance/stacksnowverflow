import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import get from 'lodash/object/get';

export default class PostBody extends Component {
	render() {
		const upvoteFunc = this.props.interact((this.upvote ? "upvote/undo" : "upvote"), this.props.type, this.props.id);
		const downvoteFunc = this.props.interact((this.downvote ? "downvote/undo" : "downvote"), this.props.type, this.props.id);
		const favoriteFunc = this.props.interact((this.favorite ? "favorite/undo" : "favorite"), this.props.type, this.props.id);
		return (
			<div className="postBody">
				<div className="postScoring">
					<Link to="/" className={"upvoteLink sprite "+(this.props.upvote ? "active" : "")} onClick={upvoteFunc}>upvote</Link>
					<div>{this.props.score}</div>
					<div></div>
					<div></div>
				</div>
				<div dangerouslySetInnerHTML={()=>{return {__html:get(this.props,'body')};}()}></div>
			</div>
			);
			/*
				<div>
					{this.props.tags.map(tag=>{
						return (
							<Link to={`/tags/${tag}`}>{tag}</Link>
							)
						})}
				</div>
			*/
		}
	}
	
PostBody.propTypes = {
	
	}
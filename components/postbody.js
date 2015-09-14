import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import get from 'lodash/object/get';

export default class PostBody extends Component {
	render() {
		const upvoteFunc = this.props.interact((this.upvote ? "upvote/undo" : "upvote"), this.props.type, this.props.id);
		const downvoteFunc = this.props.interact((this.downvote ? "downvote/undo" : "downvote"), this.props.type, this.props.id);
		const favoriteFunc = this.props.interact((this.favorite ? "favorite/undo" : "favorite"), this.props.type, this.props.id);
		return (
			<div className={"postBodyContainer "+this.props.className}>
				<div className="postScoring">
					<Link to="/" className={"upvoteLink "+(this.props.upvote ? "active" : "")} onClick={upvoteFunc}></Link>
					<div className="score">{this.props.score}</div>
					<Link to="/" className={"downvoteLink "+(this.props.downvote ? "active" : "")} onClick={downvoteFunc}></Link>
					<Link to="/" className={"favoriteLink "+(this.props.favorite ? "active" : "")} onClick={favoriteFunc}></Link>
				</div>
				<div className="postBody" dangerouslySetInnerHTML={()=>{return {__html:get(this.props,'body')};}()}></div>
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
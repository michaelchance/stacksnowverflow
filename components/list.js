import React from 'react';

export var List = React.createClass({
	render(){
		return (
			<div>
				{items.map(renderItem)}
			</div>
			)
		}
	});
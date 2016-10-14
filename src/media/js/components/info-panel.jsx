
import React from "react";

export default class InfoPanel extends React.Component {
	render() {
		return <div className="info">
			<h2>{ this.props.title }</h2> { this.props.data.join(", ") || "–" }
		</div>;
	}
}
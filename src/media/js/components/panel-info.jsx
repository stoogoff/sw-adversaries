
import React from "react";
import { symbolise } from "lib/utils";

export default class PanelInfo extends React.Component {
	render() {
		return <div className="info">
			<h2>{ this.props.title }</h2>
			{ this.props.text && this.props.text.length > 0
				? <p dangerouslySetInnerHTML= { symbolise(this.props.text) } />
				: <p>–</p>
			}
		</div>;
	}
}
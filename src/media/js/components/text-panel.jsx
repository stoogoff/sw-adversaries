
import React from "react";
import Remarkable from "remarkable";

export default class TextPanel extends React.Component {
	constructor(props) {
		super(props);

		this.md = new Remarkable();
	}

	render() {
		if(!this.props.text) {
			return null;
		}

		return <div className="text" dangerouslySetInnerHTML={ { __html: this.md.render(this.props.text) } }></div>;
	}
}
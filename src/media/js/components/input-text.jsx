
import React from "react";
import { id } from "../lib/utils";

export default class InputText extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.text);

		return <div className="input-row">
			<label htmlFor={ inputId }>{ this.props.text }:</label>
			<input id={ inputId } type="text" defaultValue={ this.props.value } onChange={ this.handleChange.bind(this) } />
		</div>;
	}
}
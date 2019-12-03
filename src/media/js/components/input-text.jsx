
import React from "react";
import { id } from "../lib/utils";

export class InputText extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className="input-row">
			<label htmlFor={ inputId }>{ this.props.label }</label>
			<input id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } />
		</div>;
	}
}

export class InputTextArea extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className="input-row">
			<label htmlFor={ inputId }>{ this.props.label }</label>
			<textarea id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } />
		</div>;
	}
}
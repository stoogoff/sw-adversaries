
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
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<input id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } />
			{ this.props.note ? <div><small>{ this.props.note }</small></div> : null }
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
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<textarea id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } />
		</div>;
	}
}
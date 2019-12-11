
import React from "react";
import { id, isNumeric } from "../lib/utils";

class BaseInputText extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false
		};
	}

	handleChange(evt) {
		let value = evt.target.value;

		this.setState({
			error: this.hasError(value)
		});

		if(this.props.handler) {
			this.props.handler(value);
		}
	}

	handleBlur() {
		this.setState({
			error: this.hasError(this.props.value)
		});
	}

	hasError(value) {
		let requiredError = this.props.required && value == "";
		let formatError = false;

		if(this.props.numeric && value != "") {
			formatError = !isNumeric(value);
		}

		return requiredError || formatError;
	}

	getClassName() {
		return "row-input" + (this.state.error ? " error" : "");
	}
}

export class InputText extends BaseInputText {
	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className={ this.getClassName() }>
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<input id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
			{ this.props.note ? <div><small>{ this.props.note }</small></div> : null }
		</div>;
	}
}

export class InputTextArea extends BaseInputText {
	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className={ this.getClassName() }>
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<textarea id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
		</div>;
	}
}


import React from "react";
import { id, isNumeric } from "../../lib/string";
import { throttle } from "../../lib/timer";

class BaseText extends React.Component {
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
		// TODO this treats a value of 0 as false so thinks it's an error
		value = value || "";

		let requiredError = this.props.required && value == "";
		let formatError = this.props.numeric && value != "" ? !isNumeric(value) : false;

		return requiredError || formatError;
	}

	getClassName() {
		return "row-input" + (this.state.error ? " error" : "");
	}
}

export class TextInput extends BaseText {
	render() {
		let inputId = this.props.label ? "input_" + id(this.props.label) : null;

		return <div className={ this.getClassName() }>
			{ this.props.label ? <label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label> : null }
			<input id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
			{ this.props.note ? <div><small>{ this.props.note }</small></div> : null }
		</div>;
	}
}

export class TextArea extends BaseText {
	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className={ this.getClassName() }>
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<textarea id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
		</div>;
	}
}

export class AutoComplete extends BaseText {
	constructor(props) {
		super(props);

		this.state.value = props.value || ""
		this.update = throttle(this.callHandler.bind(this));
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.value !== this.props.value) {
			this.setState({
				error: false,
				value: nextProps.value
			});
		}
	}

	callHandler(value) {
		if(this.props.handler) {
			this.props.handler(value);
		}
	}

	selectItem(evt) {
		let value = evt.target.getAttribute("data-value");

		this.callHandler(value);
	}

	handleChange(evt) {
		let value = evt.target.value;

		this.setState({
			error: this.hasError(value),
			value: value
		});

		this.update(value);
	}

	render() {
		let inputId = "input_" + id(this.props.label);
		let filter = this.state.value.toLowerCase();
		let values = filter == "" ? [] : this.props.values.filter(a => a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(filter) != -1);

		if(values.length == 1 && values[0] == this.state.value) {
			values = [];
		}

		return <div className={ this.getClassName() + " row-filter" }>
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<input id={ inputId } type="text" value={ this.state.value } onChange={ this.handleChange.bind(this) } onBlur={ this.handleBlur.bind(this) } />
			{ this.props.note ? <div><small>{ this.props.note }</small></div> : null }
			{ values.length > 0 ? <ul>{ values.map(m => <li onClick={ this.selectItem.bind(this) } data-value={ m }>{ m }</li>) }</ul> : null }
		</div>;
	}
}
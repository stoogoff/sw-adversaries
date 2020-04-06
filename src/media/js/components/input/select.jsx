
import React from "react";
import { id } from "../../lib/string";

export default class Select extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = this.props.label ? "input_" + id(this.props.label) : null;

		return <div className="row-input input-select">
			{ this.props.label ? <label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label> : null }
			<select id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) }>
				{ this.props.values.map(v => <option>{ v }</option>) }
			</select>
		</div>;
	}
}

import React from "react";
import { id } from "../../lib/utils";

export default class Select extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.label);

		return <div className="row-input input-select">
			<label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<select id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) }>
				{ this.props.values.map(v => <option>{ v }</option>) }
			</select>
			<svg><use xlinkHref="#icon-circle-down"></use></svg>
		</div>;
	}
}
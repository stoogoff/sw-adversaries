
import React from "react";
import { id } from "../lib/utils";

export default class InputSelect extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.text);

		return <div className="input-row input-select">
			<label htmlFor={ inputId }>{ this.props.text }:</label>
			<select id={ inputId } type="text" defaultValue={ this.props.value } onChange={ this.handleChange.bind(this) }>
				{ this.props.values.map(v => <option>{ v }</option>) }
			</select>
			<svg><use xlinkHref="#icon-circle-down"></use></svg>
		</div>;
	}
}
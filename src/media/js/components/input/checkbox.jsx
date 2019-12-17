
import React from "react";
import { id } from "../../lib/utils";

export default class Checkbox extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(this.props.label);
		}
	}

	render() {
		let inputId = "input_" + id(this.props.label);
		let checkbox = this.props.checked
			? <svg><use xlinkHref="#icon-checkbox-checked"></use></svg>
			: <svg><use xlinkHref="#icon-checkbox-unchecked"></use></svg>
		;
		let className = "row-input input-checkbox" + (this.props.checked ? " checked" : "");

		return <div className={ className } onClick={ this.handleChange.bind(this) }>
			<label htmlFor={ inputId }>{ this.props.label }</label>
			{ checkbox }
		</div>;
	}
}

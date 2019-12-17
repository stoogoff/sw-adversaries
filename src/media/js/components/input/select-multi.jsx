
import React from "react";
import { parent } from "../../lib/utils";

export default class SelectMulti extends React.Component {
	handleChange(evt) {
		let node = parent(evt.target, "li");

		if(this.props.handler) {
			this.props.handler(node.getAttribute("data-value"));
		}
	}

	render() {
		let checked = <svg><use xlinkHref="#icon-checkbox-checked"></use></svg>;
		let unchecked = <svg><use xlinkHref="#icon-checkbox-unchecked"></use></svg>;
		let values = this.props.values.map(v => {
			let isChecked = this.props.value.indexOf(v) != -1;

			return <li data-value={ v } className={ isChecked ? "checked" : "" }>
				<span onClick={ this.handleChange.bind(this) }>{ isChecked ? checked : unchecked } { v }</span>
			</li>
		});

		return <div className="row-input input-select-multi">
			<label>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<ul>
				{ values }
			</ul>
		</div>;
	}
}
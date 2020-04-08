
import React from "react";
import { id } from "../../lib/string";
import { sortByProperty } from "../../lib/list";

export class Select extends React.Component {
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

export class SelectGroup extends React.Component {
	handleChange(evt) {
		if(this.props.handler) {
			this.props.handler(evt.target.value);
		}
	}

	render() {
		let inputId = this.props.label ? "input_" + id(this.props.label) : null;
		let group = this.props.groupBy;
		let values = this.props.values;
		let display = this.props.display;
		let options = [];

		if(group) {
			values = values.sort(sortByProperty(group));

			let byGroup = {};

			values.forEach(v => {
				let currentGroup = v[group];

				if(!(currentGroup in byGroup)) {
					byGroup[currentGroup] = [];
				}

				byGroup[currentGroup].push(v[display]);
			});

			options = Object.keys(byGroup).map(m => {
				return <optgroup label={ m }>
					{ byGroup[m].map(v => <option>{ v }</option>) }
				</optgroup>;
			});
		}
		else {
			options = values.map(v => <option>{ v[display] }</option>);
		}

		return <div className="row-input input-select">
			{ this.props.label ? <label htmlFor={ inputId }>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label> : null }
			<select id={ inputId } type="text" value={ this.props.value } onChange={ this.handleChange.bind(this) }>
				<option></option>
				{ options }
			</select>
		</div>;
	}
}
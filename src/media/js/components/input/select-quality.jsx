
import React from "react";
import { parent } from "../../lib/dom";
import { TextInput } from "./text";


export default class SelectQuality extends React.Component {
	// notify handling component that the rank has changed for a selected value
	handleRankChange(name, rank) {
		let selected = this.getSelected();

		if(name in selected) {
			this.handleChange(name, rank);
		}
	}

	// notify handling component that the checked state has changed 
	handleSelectionChange(name) {
		this.handleChange(name)
	}

	handleChange(name, rank) {
		if(this.props.handler) {
			this.props.handler({
				name: name,
				rank: rank
			});
		}
	}

	getSelected() {
		let selected = {};

		if(this.props.value) {
			this.props.value.forEach(v => selected[v.name] = v);
		}

		return selected;
	}

	render() {
		// convert array of selected items to a hash using the id as the key
		let selected = this.getSelected();

		let checked = <svg><use xlinkHref="#icon-checkbox-checked"></use></svg>;
		let unchecked = <svg><use xlinkHref="#icon-checkbox-unchecked"></use></svg>;
		let values = this.props.values.map(v => {
			let isChecked = v.name in selected;
			let rank = isChecked ? selected[v.name].rank : null;

			return <li data-value={ v.name } className={ isChecked ? "checked" : "" }>
				<span onClick={ this.handleSelectionChange.bind(this, v.name) }>{ isChecked ? checked : unchecked } { v.name } { v.type == "Mod" ? " (Mod)" : "" }</span>
				{ v.ranked && isChecked ? <TextInput value={ rank } handler={ this.handleRankChange.bind(this, v.name) } required={ true } numeric={ true } /> : null }
			</li>
		});

		return <div className="row-input input-select-quality">
			<label>{ this.props.label } { this.props.required ? <span className="required">*</span> : null }</label>
			<ul>
				{ values }
			</ul>
		</div>;
	}
}

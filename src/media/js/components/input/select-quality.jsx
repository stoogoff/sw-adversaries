
import React from "react";
import { parent } from "../../lib/dom";


export default class SelectQuality extends React.Component {
	// notify handling component that the rank has changed for a selected value
	handleRankChange(evt) {
		let rank = evt.target.value;
		let name = parent(evt.target, "li").getAttribute("data-value");
		let selected = this.getSelected();

		if(name in selected) {
			this.handleChange(name, rank);
		}
	}

	// notify handling component that the checked state has changed 
	handleSelectionChange(evt) {
		let node = parent(evt.target, "li");

		this.handleChange(node.getAttribute("data-value"))
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
				<span onClick={ this.handleSelectionChange.bind(this) }>{ isChecked ? checked : unchecked } { v.name } { v.type == "Mod" ? " (Mod)" : "" }</span>
				{ v.ranked && isChecked ? <input type="text" value={ rank } onChange={ this.handleRankChange.bind(this) } /> : "" }
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

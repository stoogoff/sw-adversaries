
import React from "react";
import InputText from "./input-text";
import InputSelect from "./input-select";
import { findByProperty } from "../lib/utils";

export default class PanelTalentEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: null,
			rank: null
		};
	}

	setRank(rank) {
		this.setState({
			rank: parseInt(rank)
		});
	}

	add(name) {
		let item = this.props.list.find(findByProperty("name", name));

		this.setState({
			selected: item
		});
	}

	save() {
		let selected = this.state.selected;

		if(selected && this.props.handler) {
			let name = selected.name;

			if(selected.ranked) {
				name += " " + (this.state.rank || "1");
			}

			this.props.handler(name);
		}

		this.setState({
			selected: null,
			rank: null
		});
	}

	render() {
		let list = ["", ...this.props.list.map(i => i.name)];
		let selected = this.state.selected ? this.state.selected.name : "";

		return <div>
			<h3>{ this.props.title }</h3>
			<InputSelect text={ this.props.label } value={ selected } values={ list } handler={ this.add.bind(this) } />
			{ this.state.selected
				? <div>
					{ this.state.selected.ranked ? <InputText text="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } /> : null }
					<button className="btn" onClick={ this.save.bind(this) }>Save</button>
				</div>
				: null
			}
		</div>;
	}
}
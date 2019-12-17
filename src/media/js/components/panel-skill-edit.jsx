
import React from "react";
import { TextInput } from "./input/text";
import Select from "./input/select";
import { characteristics } from "lib/utils";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class PanelSkillEdit extends React.Component {
	constructor(props) {
		super(props);

		this.types = ["", "General", "Combat", "Knowledge"];

		this.state = {
			name: "",
			characteristic: "",
			type: ""
		};
	}

	setValue(attr) {
		return val => {
			this.setState({
				[attr]: val
			});
		}
	}

	add() {
		dispatcher.dispatch(CONFIG.SKILL_ADD, this.state);
	}

	canAdd() {
		let values = ["name", "characteristic", "type"];

		return values.map(c => this.state[c]).filter(f => f != "").length == values.length;
	}

	render() {
		return <div>
			<h3>New Skill</h3>
			<TextInput label="Skill Name" value={ this.state.name } handler={ this.setValue("name").bind(this) } required={ true } />
			<Select label="Characteristic" value={ this.state.characteristic } values={ ["", ...characteristics] } handler={ this.setValue("characteristic").bind(this) } required={ true } />
			<Select label="Type" value={ this.state.type } values={ this.types } handler={ this.setValue("type").bind(this) } required={ true } />
			<button className="btn-full" disabled={ !this.canAdd() } onClick={ this.add.bind(this) }>Add Custom Skill</button>
		</div>;
	}
}
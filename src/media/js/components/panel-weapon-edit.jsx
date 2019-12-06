
import React from "react";
import { InputText, InputTextArea } from "./input-text";
import InputSelect from "./input-select";
import InputSelectMulti from "./input-select-multi";
import { findByProperty, diceMap, symbolise } from "../lib/utils";

export default class PanelWeaponEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: null,
			name: null,
			skill: null,
			range: null,
			damage: null,
			critical: null,
			qualities: [],
			isNew: false
		};

		this.ranges = ["", "Engaged", "Short", "Medium", "Long", "Extreme"];
		this.skills = ["", ...this.props.skills.map(s => s.name)];
	}

	setName(val) {
		this.setState({
			name: val,
			isNew: !(!val || !this.state.skill || !this.state.range || !this.state.damage)
		});
	}
	setSkill(val) {
		this.setState({
			skill: val,
			isNew: !(!this.state.name || !val || !this.state.range || !this.state.damage)
		});
	}
	setRange(val) {
		this.setState({
			range: val,
			isNew: !(!this.state.name || !this.state.skill || !val || !this.state.damage)
		});
	}
	setDamage(val) {
		this.setState({
			damage: parseInt(val),
			isNew: !(!this.state.name || !this.state.skill || !this.state.range || !val)
		});
	}
	setCritical(val) {
		this.setState({
			critical: parseInt(val),
			isNew: !(!this.state.name || !this.state.skill || !this.state.range || !this.state.damage)
		});
	}
	setQualities(val) {
		let qualities = this.state.qualities;

		if(qualities.indexOf(val) == -1) {
			qualities.push(val);
		}
		else {
			qualities.splice(qualities.indexOf(val), 1);
		}

		this.setState({
			qualities: qualities,
			isNew: !(!this.state.name || !this.state.skill || !this.state.range || !this.state.damage)
		});
	}

	selectItem(name) {
		let item = this.props.list.find(findByProperty("name", name));

		this.setState({
			selected: item
		});
	}

	add() {
		let selected = this.state.selected;

		if(selected && this.props.handler) {
			this.props.handler(selected.name);
		}

		this.setState({
			selected: ""
		});
	}

	create() {
		let weapon = {
			name: this.state.name,
			skill: this.state.skill,
			range: this.state.range,
			damage: this.state.damage,
			critical: this.state.critical,
			qualities: this.state.qualities
		};

		if(this.props.handler) {
			this.props.handler(weapon);
		}

		this.setState({
			name: "",
			skill: "",
			range: "",
			damage: "",
			critical: "",
			qualities: [],
			isNew: false
		});
	}

	render() {
		let list = ["", ...this.props.list.map(i => i.name)];
		let selected = this.state.selected ? this.state.selected.name : "";
		let qualities = this.props.qualities.map(q => q.type == "Mod" ? `${q.name} (Mod)` : q.name).sort();

		return <div>
			<h3>Select Weapon</h3>
			<InputSelect label="Weapon" value={ selected } values={ list } handler={ this.selectItem.bind(this) } required={ true } />
			<button className="btn-full" disabled={ !this.state.selected } onClick={ this.add.bind(this) }>Select</button>
			<div className="divider"><span>OR</span></div>
			<h3>Create Weapon</h3>
			<InputText label="Name" value={ this.state.name } handler={ this.setName.bind(this) } required={ true } />
			<InputSelect label="Skill" value={ this.state.skill } values={ this.skills } handler={ this.setSkill.bind(this) } required={ true } />
			<InputSelect label="Range" value={ this.state.range } values={ this.ranges } handler={ this.setRange.bind(this) } required={ true } />
			<InputText label="Damage" value={ this.state.damage } handler={ this.setDamage.bind(this) } required={ true } note="Remember to add Brawn to damage for Melee or Brawl weapons." />
			<InputText label="Critical" value={ this.state.critical } handler={ this.setCritical.bind(this) } />
			<InputSelectMulti label="Qualities" value={ this.state.qualities } values={ qualities } handler={ this.setQualities.bind(this) } />
			<button className="btn-full" disabled={ !this.state.isNew } onClick={ this.create.bind(this) }>Create</button>
		</div>;
	}
}

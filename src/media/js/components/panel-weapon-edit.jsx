
import React from "react";
import { TextInput, TextArea } from "./input/text";
import Select from "./input/select";
import SelectMulti from "./input/select-multi";
import PanelCode from "./panel-code";
import { findByProperty } from "../lib/list";
import { id } from "../lib/string";
import * as CONFIG from "lib/config";

const MOD_TEXT = " (Mod)";

export default class PanelWeaponEdit extends React.Component {
	constructor(props) {
		super(props);

		let initialState = {
			selected: null,
			id: "",
			name: "",
			skill: "",
			range: "",
			damage: "",
			critical: "",
			qualities: [],
			notes: "",
			isNew: false
		};

		// set form state from initial editing prop, if available
		if(this.props.editing) {
			initialState.id = this.props.editing.id;
			initialState.name = this.props.editing.name;
			initialState.skill = this.props.editing.skill;
			initialState.range = this.props.editing.range;
			initialState.damage = this.props.editing.damage;
			initialState.critical = this.props.editing.critical;
			initialState.qualities = this.props.editing.qualities || [];
			initialState.notes = this.props.editing.notes;
		}

		this.state = initialState;

		this.ranges = ["", "Engaged", "Short", "Medium", "Long", "Extreme"];
		this.skills = ["", ...this.props.skills.map(s => s.name)];
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.editing !== this.props.editing) {
			let newState = {
				id: "",
				name: "",
				skill: "",
				range: "",
				damage: "",
				critical: "",
				qualities: [],
				notes: ""
			};

			if(nextProps.editing && "name" in nextProps.editing) {
				newState.id = this.props.editing.id;
				newState.name = this.props.editing.name;
				newState.skill = this.props.editing.skill;
				newState.range = this.props.editing.range;
				newState.damage = this.props.editing.damage;
				newState.critical = this.props.editing.critical;
				newState.qualities = this.props.editing.qualities || [];
				newState.notes = this.props.editing.notes;
			}

			this.setState(newState);
		}
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
			damage: val,
			isNew: !(!this.state.name || !this.state.skill || !this.state.range || !val)
		});
	}
	setValue(attr) {
		return val => {
			this.setState({
				[attr]: val,
				isNew: !(!this.state.name || !this.state.skill || !this.state.range || !this.state.damage)
			});
		}
	}
	setQualities(val) {
		val = val.replace(MOD_TEXT, "");

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
			id: this.state.id || CONFIG.ADVERSARY_ID + id(this.state.name),
			name: this.state.name,
			skill: this.state.skill,
			range: this.state.range,
			damage: this.state.damage,
			critical: this.state.critical,
			qualities: this.state.qualities.map(q => q.replace(MOD_TEXT, "")),
			notes: this.state.notes
		};

		if(this.props.handler) {
			this.props.handler(weapon);
		}

		if(this.props.close) {
			this.props.close();
		}

		this.setState({
			id: "",
			name: "",
			skill: "",
			range: "",
			damage: "",
			critical: "",
			qualities: [],
			notes: "",
			isNew: false
		});
	}

	addMod(list) {
		return list.map(q => q.type == "Mod" ? q.name + MOD_TEXT : q.name).sort();
	}

	render() {
		// TODO ux needs to change to allow adding of rank to some qualities
		// TODO probably best to have a separate panel for mods

		let list = ["", ...this.props.list.map(i => i.name)];
		let selected = this.state.selected ? this.state.selected.name : "";
		let qualities = this.addMod(this.props.qualities);
		let selectedQualities = this.addMod(this.props.qualities.filter(f => this.state.qualities.indexOf(f.name) != -1));
		let title = this.props.editing ? "Edit" : "Create";
		let button = this.props.editing ? "Save" : "Add New";
		let form = <div>
			<h3>{ title } Weapon</h3>
			<TextInput label="Name" value={ this.state.name } handler={ this.setName.bind(this) } required={ true } />
			<Select label="Skill" value={ this.state.skill } values={ this.skills } handler={ this.setSkill.bind(this) } required={ true } />
			<Select label="Range" value={ this.state.range } values={ this.ranges } handler={ this.setRange.bind(this) } required={ true } />
			<TextInput label="Damage" value={ this.state.damage } handler={ this.setDamage.bind(this) } required={ true } note="Remember to add Brawn to damage for Melee or Brawl weapons." />
			<TextInput label="Critical" value={ this.state.critical } handler={ this.setValue("critical").bind(this) } />
			<SelectMulti label="Qualities" value={ selectedQualities } values={ qualities } handler={ this.setQualities.bind(this) } />
			<TextArea label="Notes" value={ this.state.notes } handler={ this.setValue("notes").bind(this) } />
			<PanelCode />
			<button className="btn-full" disabled={ !this.state.isNew } onClick={ this.create.bind(this) }>{ button } Weapon</button>
		</div>;

		return <div>
			{ this.props.editing 
				? form
				:
				<div>
					<h3>Select Weapon</h3>
					<Select label="Weapon" value={ selected } values={ list } handler={ this.selectItem.bind(this) } required={ true } />
					<button className="btn-full" disabled={ !this.state.selected } onClick={ this.add.bind(this) }>Add Selected Weapon</button>
					<div className="divider"><span>OR</span></div>
					{ form }
				</div>
			}
		</div>;
	}
}

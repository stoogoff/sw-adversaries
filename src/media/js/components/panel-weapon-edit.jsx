
import React from "react";
import { TextInput, TextArea, AutoComplete } from "./input/text";
import { Select } from "./input/select";
import SelectQuality from "./input/select-quality";
import PanelCode from "./panel-code";
import { findByProperty, sortByProperty, indexOfByProperty, pluck } from "../lib/list";
import { id, isNumeric } from "../lib/string";
import { createQuality } from "../lib/utils";
import * as CONFIG from "lib/config";


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
			ranks: true, // true if every weapon quality with a rank has a numeric rank
			canSave: false
		};

		// set form state from initial editing prop, if available
		if(this.props.editing) {
			initialState.id = this.props.editing.id;
			initialState.name = this.props.editing.name;
			initialState.skill = this.props.editing.skill;
			initialState.range = this.props.editing.range;
			initialState.damage = this.props.editing.damage;
			initialState.critical = this.props.editing.critical;
			initialState.qualities = "qualities" in this.props.editing ? this.convertQualities(this.props.editing.qualities) : [];
			initialState.notes = this.props.editing.notes;
		}

		this.state = initialState;

		this.ranges = ["", "Engaged", "Short", "Medium", "Long", "Extreme"];
		this.skills = ["", pluck(...this.props.skills, "name")];
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
				newState.id = nextProps.editing.id;
				newState.name = nextProps.editing.name;
				newState.skill = nextProps.editing.skill;
				newState.range = nextProps.editing.range;
				newState.damage = nextProps.editing.damage;
				newState.critical = nextProps.editing.critical;
				newState.qualities = "qualities" in nextProps.editing ? this.convertQualities(nextProps.editing.qualities) : [];
				newState.notes = nextProps.editing.notes;
			}

			this.setState(newState);
		}
	}

	convertQualities(selectedQualities) {
		return selectedQualities.map(q => createQuality(this.props.qualities.all(), q));
	}

	setName(val) {
		this.setState({
			name: val,
			canSave: !(!val || !this.state.skill || !this.state.range || !this.state.damage || !this.state.ranks)
		});
	}
	setSkill(val) {
		this.setState({
			skill: val,
			canSave: !(!this.state.name || !val || !this.state.range || !this.state.damage || !this.state.ranks)
		});
	}
	setRange(val) {
		this.setState({
			range: val,
			canSave: !(!this.state.name || !this.state.skill || !val || !this.state.damage || !this.state.ranks)
		});
	}
	setDamage(val) {
		this.setState({
			damage: val,
			canSave: !(!this.state.name || !this.state.skill || !this.state.range || !val || !this.state.ranks)
		});
	}
	setValue(attr) {
		return val => {
			this.setState({
				[attr]: val,
				canSave: !(!this.state.name || !this.state.skill || !this.state.range || !this.state.damage || !this.state.ranks)
			});
		}
	}

	validateQualityRanks(qualities) {
		// check each rank in a quality is numeric
		let validRanks = true;

		for(let i = 0, len = qualities.length; i < len; ++i) {
			if(qualities[i].ranked) {
				validRanks = isNumeric(qualities[i].rank || "");
			}

			if(!validRanks) {
				break;
			}
		}

		this.setState({
			qualities: qualities,
			ranks: validRanks,
			canSave: !(!this.state.name || !this.state.skill || !this.state.range || !this.state.damage || !validRanks)
		});
	}

	// add or remove a quality from the list
	toggleQuality(val) {
		let qualities = this.state.qualities;
		let existingQuality = qualities.find(findByProperty("name", val.name))

		if(existingQuality) {
			qualities.splice(indexOfByProperty(qualities, "name", val.name), 1);
		}
		else {
			qualities.push(val);
		}

		this.validateQualityRanks(qualities);
	}

	// update the rank of a quality, if it exists
	updateQuality(val) {
		let qualities = this.state.qualities;
		let existingQuality = qualities.find(findByProperty("name", val.name))

		// quality exists but the rank is different so update it
		if(existingQuality && val.ranked && val.rank != existingQuality.rank) {
			existingQuality.rank = val.rank;
		}

		this.validateQualityRanks(qualities);
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
			qualities: this.state.qualities.map(q => q.name + (q.rank ? ` ${q.rank}` : ""))
		};

		if(this.state.notes) {
			weapon.notes = this.state.notes;
		}

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
			canSave: false
		});
	}

	render() {
		let list = pluck(this.props.list, "name");
		let selected = this.state.selected ? this.state.selected.name : "";
		let qualities = this.props.qualities.all().sort(sortByProperty("name"));
		let title = this.props.editing ? "Edit" : "Create";
		let button = this.props.editing ? "Save" : "Add New";
		let form = <div>
			<h3>{ title } Weapon</h3>
			<TextInput label="Name" value={ this.state.name } handler={ this.setName.bind(this) } required={ true } />
			<Select label="Skill" value={ this.state.skill } values={ this.skills } handler={ this.setSkill.bind(this) } required={ true } />
			<Select label="Range" value={ this.state.range } values={ this.ranges } handler={ this.setRange.bind(this) } required={ true } />
			<TextInput label="Damage" value={ this.state.damage } handler={ this.setDamage.bind(this) } required={ true } note="Remember to add Brawn to damage for Melee or Brawl weapons." />
			<TextInput label="Critical" value={ this.state.critical } handler={ this.setValue("critical").bind(this) } />
			<SelectQuality label="Qualities" value={ this.state.qualities } values={ qualities } select={ this.toggleQuality.bind(this) } update={ this.updateQuality.bind(this) } />
			<TextArea label="Notes" value={ this.state.notes } handler={ this.setValue("notes").bind(this) } />
			<PanelCode />
			<button className="btn-full" disabled={ !this.state.canSave } onClick={ this.create.bind(this) }>{ button } Weapon</button>
		</div>;

		return <div>
			{ this.props.editing 
				? form
				:
				<div>
					<h3>Select Weapon</h3>
					<AutoComplete label="Weapon" value={ selected } values={ list } handler={ this.selectItem.bind(this) } required={ true } />
					<button className="btn-full" disabled={ !this.state.selected } onClick={ this.add.bind(this) }>Add Selected Weapon</button>
					<div className="divider"><span>OR</span></div>
					{ form }
				</div>
			}
		</div>;
	}
}

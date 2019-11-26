
import React from "react";
import InputText from "./input-text";
import InputSelect from "./input-select";
import PanelEditList from "./panel-edit-list";

import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";



export default class EditCharacter extends React.Component {
	constructor(props) {
		super(props);

		let baseCharacter = {
			"name": "",
			"type": "",
			"description": "",
			"characteristics": {},
			"derived": {
				"defence": []
			},
			"skills": null,
			"talents": [],
			"abilities": [],
			"weapons": [],
			"gear": [],
			"tags": []
		};

		let editingCharacter = Object.assign({}, baseCharacter, props.character);

		editingCharacter.derived.defence = ["", ""];

		this.state = {
			character: editingCharacter,
			talent: null
		};
	}

	/*componentWillUpdate(nextProps, nextState) {
		if(nextProps.character !== this.props.character) {
			this.setState({
				showAll: false,
				minions: 0,
			});
		}
	}*/

	test() {
		console.log(this.state.character)
	}

	setType(newType) {
		let character = this.state.character;

		character.type = newType;

		this.setState({
			character: character
		});
	}

	addTalent(name) {
		let talent = this.props.talents.findBy("name", name);

		this.setState({
			talent: talent
		});
	}

	saveTalent() {
		let character = this.state.character;

		// TODO add ranks
		// TODO hide form in middle component
		character.talents.push(this.state.talent);

		this.setState({
			character: character,
			talent: null
		});
	}

	// remove an item from a list of properties
	removeHandler(attr) {
		return function(index) {
			let character = this.state.character;

			character[attr].splice(index, 1);

			this.setState({
				character: character
			});
		};
	}

	render() {
		let character = this.state.character;

		if(!character) {
			return null;
		}

		let characteristics = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
		let skills = this.props.skills;

console.log(character)

/*

			-Name
			-Type (should be select)
			-Characteristics
			-Soak
			-Wound Threshold
			-Strain Threshold (should only display for Nemesis)
			-Defence
			-Melee
			-Ranged
			-Skills - this needs to be a list with check boxes for minions
			Weapons (selector or add own)
			Talents (selector or add own)
			Abilities (selector or add own)
			Gear
			Tags (selector or add own - do these need to be separated out?)



			*/

		let types = ["Minion", "Rival", "Nemesis"];
		let talents = this.props.talents.filter(t => t.type == "talents");
		let abilities = this.props.talents.filter(t => t.type == "abilities");


		return <div id="edit">
			<h1>Character</h1>
			<InputText text="Name" value={ character.name } handler={ (text) => character.name = text } />
			<InputSelect text="Type" value={ character.type } values={ types } handler={ this.setType.bind(this) } />

			<div className="edit-panel">
				<h2>Characteristics</h2>
				{ characteristics.map(c => <InputText text={ c } value={ character.characteristics[c] } handler={ (text) => character.characteristics[c] = parseInt(text) } />) }
			</div>

			<div className="edit-panel">
				<h2>Derived Characteristics</h2>

				<InputText text="Soak" value={ character.derived.soak } handler={ (text) => character.derived.soak = parseInt(text) } />
				<InputText text="Wound Threshold" value={ character.derived.wounds } handler={ (text) => character.derived.wounds = parseInt(text) } />
				{ character.type == "Nemesis" ? <InputText text="Strain Threshold" value={ character.derived.strain } handler={ (text) => character.derived.strain = parseInt(text) } /> : null }
				<InputText text="Melee Defence" value={ character.derived.defence[0] } handler={ (text) => character.derived.defence[0] = parseInt(text) } />
				<InputText text="Ranged Defence" value={ character.derived.defence[1] } handler={ (text) => character.derived.defence[1] = parseInt(text) } />
			</div>

			<div className="edit-panel">
				<h2>Skills</h2>
				{ skills.map(s => <InputText text={ s.name } value={ character.skills[s.name] } handler={ (text) => character.skills[s.name] = parseInt(text) } />) }
			</div>

			<PanelEditList title="Weapons" list={ character.weapons } remove={ this.removeHandler("weapons").bind(this) }>
				<div>ADD WEAPON</div>
			</PanelEditList>
			<PanelEditList title="Talents" list={ character.talents } remove={ this.removeHandler("talents").bind(this) }>
				<div>
					<h3>Add Talent</h3>
					<InputSelect text="Talent" values={ talents.map(t => t.name) } handler={ this.addTalent.bind(this) } />
					{ this.state.talent
						? <div>
							{ this.state.talent.ranked ? <InputText text="Rank" /> : null }
							<button className="btn" onClick={ this.saveTalent.bind(this) }>Save Talent</button>
						</div>
						: null
					}
				</div>
			</PanelEditList>
			<PanelEditList title="Abilities" list={ character.abilities } remove={ this.removeHandler("abilities").bind(this) }>
				<div>ADD ABILITY</div>
			</PanelEditList>



			
			<button className="btn" onClick={ this.test.bind(this) }>Save</button>
		</div>;
	}
}

import React from "react";
import InputText from "./input-text";
import InputSelect from "./input-select";
import PanelEditList from "./panel-edit-list";

import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";



export default class EditCharacter extends React.Component {
	constructor(props) {
		super(props);
	}

	test() {
		console.log(this.props.character)
	}

	render() {
		let character = this.props.character;

		if(!character) {
			return null;
		}

		let characteristics = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
		let skills = this.props.skills;

console.log(skills)

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


changing character type doesn't force a rerender

			*/

		let types = ["Minion", "Rival", "Nemesis"];


		return <div id="edit">
			<h1>Character</h1>
			<InputText text="Name" value={ character.name } handler={ (text) => character.name = text } />
			<InputSelect text="Type" value={ character.type } values={ types } handler={ (text) => character.type = text} />

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

			<PanelEditList title="Weapons" list={ character.weapons } />
			<PanelEditList title="Talents" list={ character.talents } />
			<PanelEditList title="Abilities" list={ character.abilities } />



			
			<button className="btn" onClick={ this.test.bind(this) }>Save</button>
		</div>;
	}
}
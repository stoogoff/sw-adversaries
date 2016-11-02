
import React from "react";
import InfoPanel from "./info-panel";
import SkillPanel from "./skill-panel";
import TextPanel from "./text-panel";
import WeaponsPanel from "./weapons-panel";
import TalentPanel from "./talent-panel";
import TagPanel from "./tag-panel";

export default class Character extends React.Component {
	render() {
		let character = this.props.character;

		if(!character) {
			return null;
		}

		let characteristics = [];

		for(let i in character.characteristics) {
			characteristics.push({
				"name": i,
				"value": character.characteristics[i]
			});
		}

		
		let defence = "defence" in character.derived ? character.derived.defence.join(" | ") : "0 | 0";
		let icon = null;

		if(character.tags.indexOf("rebel alliance") != -1) {
			icon = <span className="fa fa-ra"></span>;
		}
		else if(character.tags.indexOf("empire") != -1) {
			icon = <span className="fa fa-empire"></span>;
		}

		return <div>
			<h1><div>{ icon } { character.name }</div><small className={ character.type.toLowerCase() }>{ character.type }</small></h1>
			<TextPanel text={ character.description } />
			{ character.notes ? <div className="text"><p><em>{ character.notes }</em></p></div> : null }
			<div className="column small">
				<div className="stats" id="characteristics">
					{ characteristics.map(c => {
						return <div key={ c.name }><span>{ c.value }</span><h3>{ c.name }</h3></div>
					})}
				</div>
				<div className="stats" id="derived">
					<div>
						<h3>Soak</h3>
						<span>{ character.derived.soak }</span>
					</div>
					<div>
						<h3>Wounds</h3>
						<span>{ character.derived.wounds }</span>
					</div>
					{ character.type === "Nemesis" ? <div><h3>Strain</h3><span>{ character.derived.strain }</span></div> : null }
					<div>
						<h3>Defence <small>&nbsp; Melee | Ranged</small></h3>
						<span>{ defence }</span>
					</div>
				</div>
			</div>
			<div className="column large">
				<SkillPanel character={ character } skills={ this.props.skills } />
				<WeaponsPanel title="Weapons" character={ character } skills={ this.props.skills } weapons={ this.props.weapons } qualities={ this.props.qualities } talents={ this.props.talents } />
				<TalentPanel title="Talents" data={ character.talents } talents={ this.props.talents } />
				<TalentPanel title="Abilities" data={ character.abilities } talents={ this.props.talents } />
				<InfoPanel title="Gear" data={ character.gear } />
				<TagPanel title="Tags" data={ character.tags } />
			</div>
		</div>;
	}
}
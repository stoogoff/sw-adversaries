
import React from "react";
import Remarkable from "remarkable";
import InfoPanel from "./info-panel";
import SkillPanel from "./skill-panel";
import TextPanel from "./text-panel";
import WeaponsPanel from "./weapons-panel";
import TalentPanel from "./talent-panel";
import TagPanel from "./tag-panel";
import { symbolise } from "../lib/utils";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class Character extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			minions: 1,
			currentWounds: 0
		};

		this.md = new Remarkable();
	}

	setMinions(minions) {
		if(minions < 1) {
			minions = 1;
		}

		this.setState({
			minions: minions
		});
	}

	setCurrentWounds(e) {
		e.preventDefault();
		this.setState({
			currentWounds: Number(this.refs.currentWounds.value)
		});
		this.refs.currentWounds.blur();
		this.refs.currentWounds.value = '';
	}

	addFavourite(id) {
		let character = this.props.character;

		if(!character) {
			return;
		}

		dispatcher.dispatch(CONFIG.FAVOURITE_ADD, character.id);
	}

	removeFavourite(id) {
		let character = this.props.character;

		if(!character) {
			return;
		}

		dispatcher.dispatch(CONFIG.FAVOURITE_REMOVE, character.id);
	}

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
			icon = <svg><use href="#rebel-alliance"></use></svg>;
		}
		else if(character.tags.indexOf("empire") != -1) {
			icon = <svg><use href="#galactic-empire"></use></svg>;
		}

		let fav = null;

		if(character.favourite) {
			fav = <svg className="star-filled outline" onClick={ this.removeFavourite.bind(this) }><use href="#icon-star-full"></use></svg>;
		}
		else {
			fav = <svg onClick={ this.addFavourite.bind(this) }><use href="#icon-star-empty"></use></svg>;
		}

		return <div className={ !this.props.visible ? "hidden" : null }>
			<h1 data-adversary-type={ character.type }>{ icon } { character.name }</h1>
			<h2 className="subtitle">
				<span className={ character.type.toLowerCase() }>{ character.type }</span>
				{ fav }
			</h2>
			<TextPanel text={ character.description } />
			{ character.notes ? <div className="text" dangerouslySetInnerHTML={ symbolise(this.md.render(`*${character.notes}*`)) }></div> : null }
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
						<h3>Wounds <small>Threshold | Current</small></h3>
						<span>{ character.type === "Minion" ? character.derived.wounds * this.state.minions : character.derived.wounds } |</span>
						<form style={{display: 'inline'}} onSubmit={this.setCurrentWounds.bind(this)}><input type="text" placeholder={this.state.currentWounds} maxLength="2" ref="currentWounds" /></form>
					</div>
					{ character.type === "Nemesis" ? <div><h3>Strain <small>Threshold | Current</small></h3><span>{ character.derived.strain } |</span><input type="text" defaultValue="0" maxLength="2" /></div> : null }
					<div>
						<h3>Defence <small>&nbsp; Melee | Ranged</small></h3>
						<span>{ defence }</span>
					</div>
				</div>
			</div>
			<div className="column large">
				<SkillPanel character={ character } skills={ this.props.skills } currentWounds={ this.state.currentWounds } minions={ this.state.minions } setMinions={ this.setMinions.bind(this) } />
				<WeaponsPanel title="Weapons" character={ character } skills={ this.props.skills } weapons={ this.props.weapons } qualities={ this.props.qualities } talents={ this.props.talents } currentWounds={ this.state.currentWounds } minions={ this.state.minions } />
				<TalentPanel title="Talents" data={ character.talents } talents={ this.props.talents } />
				<TalentPanel title="Abilities" data={ character.abilities } talents={ this.props.talents } />
				<InfoPanel title="Gear" data={ character.gear } />
				<TagPanel title="Tags" data={ character.tags } />
			</div>
		</div>;
	}
}

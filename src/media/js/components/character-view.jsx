
import React from "react";
import Remarkable from "remarkable";
import PanelInfo from "./panel-info";
import PanelSkill from "./panel-skill";
import PanelText from "./panel-text";
import PanelWeapons from "./panel-weapons";
import PanelTalent from "./panel-talent";
import PanelTag from "./panel-tag";
import { symbolise, getSourceLink } from "../lib/utils";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class CharacterView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			minions: 1,
			currentWounds: 0,
			aliveMinions: 1,
		};

		this.md = new Remarkable();
	}

	setMinions(minions) {
		if(minions <= 1) {
			minions = 1;
			this.setState({
				currentWounds: 0,
				aliveMinions: 0
			});
		} else {
			this.setAliveMinions(minions, this.state.currentWounds);
			}

		this.setState({
			minions: minions
		});

	}

	setAliveMinions(minions, currentWounds) {
		let character = this.props.character;

		let aliveMinions = minions;
		if (currentWounds > 0) aliveMinions = minions - Math.floor((currentWounds-1)/character.derived.wounds)

		this.setState({
			aliveMinions: aliveMinions
		});
	}

	setCurrentWounds(e) {
		e.preventDefault();
		this.setState({
			currentWounds: Number(this.refs.currentWounds.value)
		});
		this.setAliveMinions(this.state.minions, this.refs.currentWounds.value);
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

	copyAdversary(id) {
		let character = this.props.character;

		if(!character) {
			return;
		}

		dispatcher.dispatch(CONFIG.ADVERSARY_COPY, character.id);
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

		// header icon based on important tags
		let icon = null;

		if(character.tags.indexOf("rebel alliance") != -1) {
			icon = <svg><use xlinkHref="#rebel-alliance"></use></svg>;
		}
		else if(character.tags.indexOf("empire") != -1) {
			icon = <svg><use xlinkHref="#galactic-empire"></use></svg>;
		}
		else if(character.tags.indexOf("first order") != -1) {
			icon = <svg><use xlinkHref="#first-order"></use></svg>;
		}

		// favourite icon
		let fav = null;

		if(character.favourite) {
			fav = <svg className="star-filled outline" onClick={ this.removeFavourite.bind(this) }><use xlinkHref="#icon-star-full"></use></svg>;
		}
		else {
			fav = <svg onClick={ this.addFavourite.bind(this) }><use xlinkHref="#icon-star-empty"></use></svg>;
		}

		// get all of the character's skills and characteristics as a hash
		let stats = {};

		for(var i in character.characteristics) {
			stats[i] = character.characteristics[i];
		}

		if(character.type !== "Minion") {
			for(var i in character.skills) {
				stats[i] = character.skills[i];
			}

			// add force rating
			(character.talents || []).forEach(t => {
				if(t && t.startsWith && t.startsWith("Force Rating")) {
					stats["Force Rating"] = t.split(" ")[2];
				}
			});
		}

		let source = null;
		let sourceTag = character.tags.find(t => t.startsWith("source:"));

		if(character.source && sourceTag) {
			let url = character.source.length ? character.source : character.source.url;
			let owner = character.source.length ? "" : `${character.source.owner} of`;

			source = `<p><em>${character.name} stats provided by ${owner} ${getSourceLink(sourceTag)}. Click to <a href="${url}">view original stats and descriptions</a>.</em></p>`;
		}

		return <div className={ !this.props.visible ? "hidden" : null }>
			<h1 data-adversary-type={ character.type } className={ character.devOnly ? "dev" : ""}>{ icon } { character.name }</h1>
			<h2 className="subtitle">
				<span className={ character.type.toLowerCase() }>{ character.type }</span>
				<svg onClick={ this.copyAdversary.bind(this) }><use xlinkHref="#icon-edit"></use></svg>
				{ fav }
			</h2>
			<PanelText text={ character.description } />
			{ character.notes ? <div className="text" dangerouslySetInnerHTML={ symbolise(this.md.render(`*${character.notes}*`)) }></div> : null }
			{ source ? <div className="text" dangerouslySetInnerHTML={ { __html: source } }></div> : null }
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
				<PanelSkill character={ character } skills={ this.props.skills } aliveMinions={ this.state.aliveMinions } minions={ this.state.minions } setMinions={ this.setMinions.bind(this) } />
				<PanelWeapons title="Weapons" character={ character } skills={ this.props.skills } weapons={ this.props.weapons } qualities={ this.props.qualities } talents={ this.props.talents } aliveMinions={ this.state.aliveMinions } minions={ this.state.minions } />
				<PanelTalent title="Talents" stats={ stats } data={ character.talents } talents={ this.props.talents } />
				<PanelTalent title="Abilities" stats={ stats } data={ character.abilities } talents={ this.props.talents } />
				<PanelInfo title="Gear" data={ character.gear } />
				<PanelTag title="Tags" data={ character.tags } />
			</div>
		</div>;
	}
}

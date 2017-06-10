
import React from "react";
import { dice, minionSkill } from "lib/utils";

export default class SkillPanel extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			showAll: false,
			minions: 0
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.character !== this.props.character) {
			this.setState({
				showAll: false,
				minions: 0
			});
		}
	}

	toggleSkills() {
		this.setState({
			showAll: !this.state.showAll
		});
	}

	increaseMinions() {
		this.props.setMinions(this.props.minions + 1);
	}

	decreaseMinions() {
		this.props.setMinions(this.props.minions - 1);
	}

	resetMinions() {
		this.props.setMinions(1);
	}

	render() {
		if(this.props.character == null) {
			return null;
		}
		
		let character = this.props.character;
		let skills = [];
		let allSkills = this.props.skills.all();
		let characterSkills = {};

		if(Array.isArray(character.skills)) {
			character.skills.forEach(s => characterSkills[s] = 0);
		}
		else {
			characterSkills = character.skills;
		}

		allSkills.forEach(skill => {
			if(this.state.showAll || skill.name in characterSkills) {
				if(this.state.showAll && "hide" in skill && skill.hide && !(skill.name in characterSkills)) {
					return;
				}

				let stat = character.characteristics[skill.characteristic];
				let value = characterSkills[skill.name] || 0;

				if(character.type == "Minion") {
					value = minionSkill(this.props.minions, skill.name, characterSkills);
				}

				skills.push({
					"id": skill.id,
					"name": skill.name,
					"value": value,
					"characteristic": skill.characteristic,
					"stat": stat,
					"icons": dice(stat, value),
					"hasRank": this.state.showAll && skill.name in characterSkills
				});
			}
		});

		return <div className="info">
			<h2>Skills { character.type == "Minion" ? <small>(Group Only)</small> : null }</h2>
			<div id="show-all">
				<small className="btn" onClick={ this.toggleSkills.bind(this) }>{ this.state.showAll ? <svg><use href="#icon-checkbox-checked"></use></svg> : <svg><use href="#icon-checkbox-unchecked"></use></svg> } Show all</small>
			</div>
			{ skills.length == 0 ? <p>–</p> :
			<table className="skills">
				<thead>
					<tr>
						<th>Skill</th>
						<th>Characteristic</th>
						{ character.type != "Minion" ? <th>Rank</th> : null }
						<th>Roll
							{ character.type == "Minion" ?
								<span>
									<small> (for { this.props.minions })</small> 
									<span className="pull-right">
										<span className="link" onClick={ this.increaseMinions.bind(this) } title="Add Minion">&nbsp;+&nbsp;</span> /
										<span className="link" onClick={ this.decreaseMinions.bind(this) } title="Remove Minion">&nbsp;-&nbsp;</span> /
										<span className="link" onClick={ this.resetMinions.bind(this) } title="One Minion">&nbsp;1&nbsp;</span>
									</span>
								</span> : null }
						</th>
					</tr>
				</thead>
				<tbody>
					{  skills.map(s => {
						return <tr key={ s.id }>
							<td>{ s.hasRank ? <strong>{ s.name }</strong> : s.name }</td>
							<td><small>{ s.characteristic }</small></td>
							{ character.type != "Minion" ? <td>{ s.value }</td> : null }
							<td dangerouslySetInnerHTML={ s.icons } />
						</tr>
					})}
				</tbody>
			</table> }
		</div>;
	}
}
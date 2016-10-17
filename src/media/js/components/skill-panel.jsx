
import React from "react";
import { dice } from "lib/utils";

export default class SkillPanel extends React.Component {
	render() {
		if(this.props.character == null) {
			return null;
		}
		
		let character = this.props.character;
		let skills = [];
		let allSkills = this.props.skills.all();

		for(let i in character.skills) {
			let skill = allSkills.find(s => s.name == i);

			if(skill == null) {
				continue;
			}

			let stat = character.characteristics[skill.characteristic];
			let value = character.skills[i];

			skills.push({
				"id": skill.id,
				"name": i,
				"value": value,
				"characteristic": skill.characteristic,
				"stat": stat,
				"icons": dice(stat, value)
			});
		}

		return <div className="info">
			<h2>Skills { character.type == "Minion" ? <small>(Group Only)</small> : null }</h2>
			<table className="skills">
				<thead>
					<tr>
						<th>Skill</th>
						<th>Characteristic</th>
						{ character.type != "Minion" ? <th>Rank</th> : null }
						<th>Roll</th>
					</tr>
				</thead>
				<tbody>
					{  skills.map(s => {
						return <tr key={ s.id }>
							<td>{ s.name }</td>
							<td><small>{ s.characteristic }</small></td>
							{ character.type != "Minion" ? <td>{ s.value }</td> : null }
							<td dangerouslySetInnerHTML={ s.icons } />
						</tr>
					})}
				</tbody>
			</table>
		</div>;
	}
}
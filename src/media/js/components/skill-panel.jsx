
import React from "react";
import { dice } from "lib/utils";

export default class SkillPanel extends React.Component {
	render() {
		if(this.props.character == null) {
			return null;
		}
		
		let character = this.props.character;
		let title = character.type === "Minion" ? "Skills (group only)": "Skills";
		let skills = [];
		let allSkills = this.props.skills.get();

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
				"images": dice(stat, value)
			});
		}

		return <div className="info">
			<h2>{ title }</h2>
			<table>
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
							<td><small>({ s.characteristic })</small></td>
							{ character.type != "Minion" ? <td>{ s.value }</td> : null }
							<td>
								{ s.images.map((img, i) => <span key={ i } className={ img }></span>)}
							</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>;
	}
}
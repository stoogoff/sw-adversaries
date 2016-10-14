
import React from "react";
import { dice } from "lib/utils";

export default class WeaponsPanel extends React.Component {
	render() {
		if(this.props.character == null) {
			return null;
		}

		let character = this.props.character;
		let weapons = [];
		let allWeapons = this.props.weapons.get();
		let allSkills = this.props.skills.get();

		character.weapons.forEach(w => {
			let weapon = allWeapons.find(a => a.name == w);

			if(weapon == null) {
				return;
			}

			// melee weapon so work out brawn damage
			if("plus-damage" in weapon) {
				let brawn  = character.characteristics.Brawn;

				weapon["damage"] = weapon["plus-damage"] + brawn;
			}

			// get dice values
			let skill = allSkills.find(s => s.name == weapon.skill);

			if(skill == null) {
				return;
			}

			let stat = character.characteristics[skill.characteristic];
			let value = character.skills[weapon.skill];

			weapon.images = dice(stat, value);

			weapons.push(weapon);
		});

		return <div className="info">
			<h2>Weapons</h2>
			<table>
				<thead>
					<tr>
						<th>Weapon</th>
						<th>Skill</th>
						<th>Range</th>
						<th>Damage</th>
						<th>Critical</th>
						<th>Roll</th>
					</tr>
				</thead>
				<tbody>
					{ weapons.map(w => {
						return <tr key={ w.id }>
							<td>{ w.name }</td>
							<td><small>{ w.skill }</small></td>
							<td><small>{ w.range }</small></td>
							<td>{ w.damage }</td>
							<td>{ w.critical }</td>
							<td>{ w.images.map((img, i) => <span key={ i } className={ img }></span>)}</td>
						</tr>
					}) }
				</tbody>
			</table>
		</div>;
	}
}
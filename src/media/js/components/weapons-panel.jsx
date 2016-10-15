
import React from "react";
import { dice, id } from "lib/utils";

function getWeaponDetails(weapon, character, allSkills) {
	if(!("id" in weapon)) {
		weapon.id = id(weapon.name);
	}

	// melee weapon so work out brawn damage
	if("plus-damage" in weapon) {
		let brawn  = character.characteristics.Brawn;

		weapon["damage"] = weapon["plus-damage"] + brawn;
	}

	// get dice values
	let skill = allSkills.find(s => s.name == weapon.skill);

	if(skill == null) {
		weapon.images = [];

		return weapon;
	}

	let stat = character.characteristics[skill.characteristic] || 0;
	let value = character.skills[weapon.skill] || 0;

	weapon.images = dice(stat, value);

	return weapon;
}

export default class WeaponsPanel extends React.Component {
	render() {
		if(this.props.character == null) {
			return null;
		}

		let character = this.props.character;
		let weapons = [];
		let allWeapons = this.props.weapons != null ? this.props.weapons.all() : null;
		let allSkills = this.props.skills != null ? this.props.skills.all() : null;

		if(allWeapons == null || allSkills == null) {
			return null;
		}

		character.weapons.forEach(w => {
			let weapon = allWeapons.find(a => a.name == w);

			if(!weapon) {
				return null;
			}

			weapons.push(getWeaponDetails(weapon, character, allSkills));
		});

		if("specialist-weapons" in character) {
			character["specialist-weapons"].forEach(w => weapons.push(getWeaponDetails(w, character, allSkills)));
		}

		return <div className="info">
			<h2>Weapons</h2>
			<table>
				<thead>
					<tr>
						<th>Weapon</th>
						<th>Range</th>
						<th>Dam/Crit</th>
						<th>Roll</th>
					</tr>
				</thead>
				<tbody>
					{ weapons.map(w => {
						return <tr key={ w.id }>
							<td>{ w.name } <small>({ w.skill })</small></td>
							<td><small>{ w.range }</small></td>
							<td>{ w.damage } / { w.critical }</td>
							<td>{ w.images.map((img, i) => <span key={ i } className={ img }></span>)}</td>
						</tr>
					}) }
				</tbody>
			</table>
		</div>;
	}
}
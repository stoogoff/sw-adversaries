
import React from "react";
import { id, symbolise, sortByProperty } from "lib/utils";

export default class TalentPanel extends React.Component {
	statify(text) {
		Object.keys(this.props.stats).forEach(k => {
			let reg = new RegExp(`\{${k}\}`, "g");

			text = text.replace(reg, this.props.stats[k]);
		});

		return text;
	}

	render() {
		if(this.props.data == null) {
			return null;
		}

		let stats = this.props.stats;
		let data = this.props.data;
		let talents = [];
		let allTalents = this.props.talents.all();

		data.forEach(t => {
			if(t instanceof Object) {
				if(!("id" in t)) {
					t.id = id(t.name);
				}

				talents.push(t);

				return;
			}

			let talentName = t.replace(/\s\d+$/, "");
			let talent = allTalents.find(i => i.name == talentName)

			if(talent != null) {
				talents.push({
					id: talent.id,
					name: t,
					description: this.statify(talent.description)
				});
			}
		});

		talents.sort(sortByProperty("name"));

		return <div className="info">
			<h2>{ this.props.title }</h2>
			{ talents.length > 0 ? talents.map(t => <p key={ t.id }><strong>{ t.name }{ t.description == "" ? "" : ":" } </strong> <span dangerouslySetInnerHTML={ symbolise(t.description) } /></p> ) : <p>–</p> }
		</div>;
	}
}
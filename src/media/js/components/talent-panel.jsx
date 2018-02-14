
import React from "react";
import { id, symbolise, statify, sortByProperty } from "lib/utils";

export default class TalentPanel extends React.Component {
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

			let ranked = t.match(/\s(\d+)$/);
			let ranks = ranked ? ranked[1] : 1;
			let talentName = t.replace(/\s\d+$/, "");
			let talent = allTalents.find(i => i.name == talentName);

			if(talent != null) {
				talents.push({
					id: talent.id,
					name: t,
					description: statify(talent.description, this.props.stats, Number(ranks))
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
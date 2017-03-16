
import React from "react";
import { id, symbolise, sortByProperty } from "lib/utils";

export default class TalentPanel extends React.Component {
	render() {
		if(this.props.data == null) {
			return null;
		}

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
					description: talent.description
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
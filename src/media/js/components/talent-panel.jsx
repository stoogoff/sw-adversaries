
import React from "react";
import { id, symbolise, sortByProperty } from "lib/utils";

export default class TalentPanel extends React.Component {
	statify(text, ranks) {
		Object.keys(this.props.stats).forEach(k => {
			let reg = new RegExp(`\{${k}\}`, "g");

			text = text.replace(reg, this.props.stats[k]);
		});

		// treat ranks independantly then do something like this
		// replace {ranks|filter}, function
		// where filter is something like multiply-10, times, word etc

		// special cases
		let words = ["", "one", "two", "three"];
		let times = ["", "once", "twice", "three times", "four times", "five times"];

		text = text.replace(/\{ranks\}/, ranks);
		text = text.replace(/\{ranks\|words\}/, s => words[ranks]);
		text = text.replace(/\{ranks\|times\}/, s => times[ranks]);
		text = text.replace(/\{ranks\|multiply-10\}/, s => ranks * 10);
		text = text.replace(/\{ranks\|multiply-50\}/, s => ranks * 50);
		text = text.replace(/\{ranks\|plus-2\}/, s => ranks + 2);

		// dice, this needs to be simplified
		let setback = ["", ":setback:", ":setback::setback:", ":setback::setback::setback:"]
		let boost = ["", ":boost:", ":boost::boost:", ":boost::boost::boost:"]
		let success = ["", ":success:", ":success::success:", ":success::success::success:"]
		let force = ["", ":force:", ":force::force:", ":force::force::force:"]

		text = text.replace(/\{ranks\|setback\}/, s => setback[ranks]);
		text = text.replace(/\{ranks\|boost\}/, s => boost[ranks]);
		text = text.replace(/\{ranks\|success\}/, s => success[ranks]);
		text = text.replace(/\{ranks\|force\}/, s => force[ranks]);

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

			let ranked = t.match(/\s(\d+)$/);
			let ranks = ranked ? ranked[1] : 1;

			console.log(t, ranks)

			let talentName = t.replace(/\s\d+$/, "");
			let talent = allTalents.find(i => i.name == talentName);

			if(talent != null) {
				talents.push({
					id: talent.id,
					name: t,
					description: this.statify(talent.description, Number(ranks))
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
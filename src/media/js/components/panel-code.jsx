
import React from "react";
import { diceMap, symbolise } from "../lib/utils";

export default class PanelTalentEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hideCodes: true
		};

		this.codes = Object.keys(diceMap).map(key => {
			let row = <tr><td>:{ key }:</td><td dangerouslySetInnerHTML={ { __html: diceMap[key] } }/></tr>;
			let header = null;

			switch(key) {
				case "boost":
					header = <tr><th>Code</th><th>Dice</th></tr>;
					break;

				case "advantage":
					header = <tr><th>Code</th><th>Result</th></tr>;
					break;

				case "average":
					header = <tr><th>Code</th><th>Difficulty</th></tr>;
					break;

			}

			return header ? [header, row] : row;
		});
	}

	render() {
		return <div>
			<p>Add symbols for dice types, dice results, or difficulty by surrounding the symbol name with <code>:</code>, e.g. <code>:boost:</code>, <code>:triumph:</code>, <code>:hard:</code>. Difficulty dice can be upgraded by putting a hyphen followed by the number of dice to upgrade, e.g. <code>:easy-1:</code> for a single challenge die, <code>:average-1:</code> for a difficulty die and a challenge die.</p>
			{ this.state.hideCodes
				? <p><span className="link" onClick={ () => this.setState({ hideCodes: false }) }>Click to show all symbol codes.</span></p>
				: <div>
					<p>The following codes can be used to add symbols to the description field:</p>
					<table className="skills small">
						<tbody>{ this.codes }</tbody>
					</table>
					<p><span className="link" onClick={ () => this.setState({ hideCodes: true }) }>Click to hide symbol codes.</span></p>
				</div>
			}
		</div>;
	}
}



import React from "react";
import { InputText, InputTextArea } from "./input-text";
import InputSelect from "./input-select";
import { findByProperty, diceMap, symbolise } from "../lib/utils";

export default class PanelTalentEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: null,
			name: null,
			rank: null,
			description: null,
			isNew: false,
			hideCodes: true
		};

		this.codes = Object.keys(diceMap).map(key => <tr><td>:{ key }:</td><td dangerouslySetInnerHTML={ { __html: diceMap[key] } }/></tr>);
	}

	setRank(rank) {
		this.setState({
			rank: parseInt(rank)
		});
	}

	setName(name) {
		this.setState({
			name: name,
			isNew: !(!name || !this.state.description)
		});
	}

	setDesc(desc) {
		this.setState({
			description: desc,
			isNew: !(!this.state.name || !desc)
		});
	}

	selectItem(name) {
		let item = this.props.list.find(findByProperty("name", name));

		this.setState({
			selected: item
		});
	}

	add() {
		let selected = this.state.selected;

		if(selected && this.props.handler) {
			let name = selected.name;

			if(selected.ranked) {
				name += " " + (this.state.rank || "1");
			}

			this.props.handler(name);
		}

		this.setState({
			selected: null,
			rank: null
		});
	}

	create() {
		let talent = {
			name: this.state.name,
			description: this.state.description
		};

		if(this.state.rank) {
			talent.name += ` ${this.state.rank}`;
			talent.ranked = true;
		}

		if(this.props.handler) {
			this.props.handler(talent);
		}

		this.setState({
			name: null,
			description: null,
			rank: null,
			isNew: false
		});
	}

	render() {
		let list = ["", ...this.props.list.map(i => i.name)];
		let selected = this.state.selected ? this.state.selected.name : "";

		return <div>
			<h3>Select { this.props.title }</h3>
			<InputSelect label={ this.props.title } value={ selected } values={ list } handler={ this.selectItem.bind(this) } />
			{ this.state.selected
				? <div>
					{ this.state.selected.ranked ? <InputText label="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } /> : null }
					<button className="btn" onClick={ this.add.bind(this) }>Add</button>
				</div>
				: null
			}
			<h3>Create { this.props.title }</h3>
			<InputText label="Name" value={ this.state.name } handler={ this.setName.bind(this) } />
			<InputText label="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } />
			<InputTextArea label="Description" value={ this.state.description } handler={ this.setDesc.bind(this) } />
			<p>Add symbols for dice types, dice results, or difficulty by surrounding the symbol name with <code>:</code>, e.g. <code>:boost:</code>, <code>:triumph:</code>, <code>:hard:</code>. Difficulty dice can be upgraded by putting a hyphen followed by the number of dice to upgrade, e.g. <code>:easy-1:</code> for a single challenge die, <code>:average-1:</code> for a difficulty die and a challenge die.</p>
			{ this.state.hideCodes
				? <p><span className="link" onClick={ () => this.setState({ hideCodes: false }) }>Click to show all symbol codes.</span></p>
				: <div>
					<p>The following codes can be used to add symbols to the description field:</p>
					<table className="skills small">
						<thead>
							<tr><th>Code</th><th>Symbol</th></tr>
						</thead>
						<tbody>{ this.codes }</tbody>
					</table>
					<p><span className="link" onClick={ () => this.setState({ hideCodes: true }) }>Click to hide symbol codes.</span></p>
				</div>
			}
			{ this.state.isNew ? <button className="btn" onClick={ this.create.bind(this) }>Create</button> : null }
		</div>;
	}
}


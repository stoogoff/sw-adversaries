
import React from "react";
import { InputText, InputTextArea } from "./input-text";
import InputSelect from "./input-select";
import PanelCode from "./panel-code";
import * as CONFIG from "lib/config";
import { findByProperty, diceMap, symbolise, isNumeric, id } from "../lib/utils";

export default class PanelTalentEdit extends React.Component {
	constructor(props) {
		super(props);

		let initialState = {
			selected: "",
			id: "",
			name: "",
			rank: "",
			description: "",
			isNew: false
		};

		// set form state from initial editing prop, if available
		if(this.props.editing) {
			initialState.id = this.props.editing.id;
			initialState.name = this.props.editing.name;
			initialState.rank = this.props.editing.rank;
			initialState.description = this.props.editing.description;
		}

		this.state = initialState;
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.editing !== this.props.editing) {
			let newState = {
				id: "",
				name: "",
				rank: "",
				description: ""
			};

			if(nextProps.editing && "name" in nextProps.editing) {
				newState.id = nextProps.editing.id;
				newState.name = nextProps.editing.name;
				newState.rank = nextProps.editing.rank;
				newState.description = nextProps.editing.description;
			}

			this.setState(newState);
		}
	}

	setRank(rank) {
		this.setState({
			rank: rank
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
				name += " " + this.state.rank;
			}

			this.props.handler(name);
		}

		this.setState({
			selected: "",
			rank: ""
		});
	}

	create() {
		let talent = {
			id: this.state.id || CONFIG.ADVERSARY_ID + id(this.state.name),
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

		if(this.props.close) {
			this.props.close();
		}

		this.setState({
			id: "",
			name: "",
			description: "",
			rank: "",
			isNew: false
		});
	}

	canAddSelected() {
		// no selected item so can't add
		if(!this.state.selected) {
			return false;
		}

		// a selected item which isn't ranked so can add
		if(!this.state.selected.ranked) {
			return true;
		}

		// can add if rank is filled in and is numeric
		return this.state.rank != "" && isNumeric(this.state.rank);
	}

	render() {
		let list = ["", ...this.props.list.map(i => i.name)];
		let selected = this.state.selected ? this.state.selected.name : "";

		return <div>
			{ this.props.editing 
				?
				<div>
					<h3>Edit { this.props.title }</h3>
					<InputText label="Name" value={ this.state.name } handler={ this.setName.bind(this) } required={ true } />
					<InputText label="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } />
					<InputTextArea label="Description" value={ this.state.description } handler={ this.setDesc.bind(this) } required={ true } />
					<button className="btn-full" disabled={ !this.state.isNew } onClick={ this.create.bind(this) }>Edit { this.props.title }</button>
					<PanelCode />
				</div>
				:
				<div>
					<h3>Select { this.props.title }</h3>
					<InputSelect label={ this.props.title } value={ selected } values={ list } handler={ this.selectItem.bind(this) } required={ true } />
					{ this.state.selected && this.state.selected.ranked
						? <InputText label="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } required={ true } numeric={ true } />
						: null
					}
					<button className="btn-full" disabled={ !this.canAddSelected() } onClick={ this.add.bind(this) }>Add Selected { this.props.title }</button>
					<div className="divider"><span>OR</span></div>
					<h3>Create { this.props.title }</h3>
					<InputText label="Name" value={ this.state.name } handler={ this.setName.bind(this) } required={ true } />
					<InputText label="Rank" value={ this.state.rank } handler={ this.setRank.bind(this) } />
					<InputTextArea label="Description" value={ this.state.description } handler={ this.setDesc.bind(this) } required={ true } />
					<button className="btn-full" disabled={ !this.state.isNew } onClick={ this.create.bind(this) }>Create New { this.props.title }</button>
					<PanelCode />
				</div>
			}
		</div>;
	}
}



import React from "react";
import { AutoComplete } from "./input/text";

export default class PanelTagEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: "",
		};
	}

	selectItem(tag) {
		this.setState({
			selected: tag
		})
	}

	add() {
		let selected = this.state.selected;

		if(selected && this.props.handler) {
			this.props.handler(selected);
		}

		this.setState({
			selected: "",
		});
	}

	canAddSelected() {
		return this.state.selected != ''
	}

	render() {
		let list = this.props.list
		let selected = this.state.selected;

		return <div>
			<h3>Select { this.props.title }</h3>
			<AutoComplete label={ this.props.title } value={ selected } values={ list } handler={ this.selectItem.bind(this) } required={ true } />
			<button className="btn-full" disabled={ !this.canAddSelected() } onClick={ this.add.bind(this) }>Add Selected { this.props.title }</button>
		</div>
	}
}


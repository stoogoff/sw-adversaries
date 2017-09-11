
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { parent } from "lib/utils";

export default class Tabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: -1
		};
	}

	add() {
		dispatcher.dispatch(CONFIG.TAB_ADD);
	}

	remove(evt) {
		console.log("remove")
		console.log(evt)
		dispatcher.dispatch(CONFIG.TAB_REMOVE, this._getIndex(evt.target));
	}

	showMenu(evt) {
		let index = this._getIndex(evt.target);

		this.setState({
			active: index === this.state.active ? -1 : index
		});
	}

	view(evt) {
		dispatcher.dispatch(CONFIG.TAB_CHANGE, this._getIndex(evt.target));
	}

	_getIndex(target) {
		let node = parent(target, "li");

		if(node) {
			return parseInt(node.getAttribute("data-index"), 10)
		}

		return -1;
	}

	render() {
		let tabs = this.props.tabs;

		return <ul id="tabs">
			{ tabs.map((t, i) => <li key={ i } className={ i == this.props.selectedIndex ? "active" : null } data-index={ i }>
				<span className="btn" onClick={ this.view.bind(this) }>{ t }</span>
				<small className="btn tools" onClick={ this.showMenu.bind(this) }><svg><use href="#icon-cog"></use></svg></small>

				<ul className={ this.state.active ==  i ? "active" : "" }>
					<li>{ t }</li>
					<li>Colour</li>
					<li onClick={ this.remove.bind(this) }>Remove <small className="btn tools"><svg><use href="#icon-cross"></use></svg></small></li>
				</ul>
			</li>) }
			<li className="tools"><small className="btn" onClick={ this.add.bind(this) }><svg><use href="#icon-plus"></use></svg> Add</small></li>
		</ul>;
	}
}
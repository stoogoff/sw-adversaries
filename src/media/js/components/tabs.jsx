
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { parent } from "lib/utils";

export default class Tabs extends React.Component {
	add() {
		dispatcher.dispatch(CONFIG.TAB_ADD);
	}

	remove(evt) {
		dispatcher.dispatch(CONFIG.TAB_REMOVE, this._getIndex(evt.target));
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
				{ tabs.length > 1 ? <small className="btn tools" onClick={ this.remove.bind(this) }><svg><use href="#icon-cross"></use></svg></small>
					: null
				}
			</li>) }
			<li className="tools"><small className="btn" onClick={ this.add.bind(this) }><svg><use href="#icon-plus"></use></svg> Add</small></li>
		</ul>;
	}
}
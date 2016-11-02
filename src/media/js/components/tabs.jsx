
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class Tabs extends React.Component {
	add() {
		dispatcher.dispatch(CONFIG.TAB_ADD);
	}

	remove() {
		dispatcher.dispatch(CONFIG.TAB_REMOVE);
	}

	view(evt) {
		let index = parseInt(evt.target.getAttribute("data-index"));

		dispatcher.dispatch(CONFIG.TAB_CHANGE, index);
	}

	render() {
		let tabs = this.props.tabs;

		return <ul id="tabs">
			{ tabs.map((t, i) => <li key={ i } className={ i == this.props.selectedIndex ? "active" : null }><span className="btn" onClick={ this.view.bind(this) } data-index={ i }>{ t }</span></li>) }
			<li><small className="btn" onClick={ this.add.bind(this) }>Add</small></li>
			<li><small className="btn" onClick={ this.remove.bind(this) }>Remove</small></li>
		</ul>;
	}
}
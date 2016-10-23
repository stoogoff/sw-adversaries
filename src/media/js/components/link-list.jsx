
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class LinkList extends React.Component {
	handler(evt) {
		var id = evt.target.getAttribute("data-target");

		dispatcher.dispatch(CONFIG.VIEW_OBJECT, id);
	}

	render() {
		let list = this.props.data;

		if(list == null) {
			return null;
		}

		return <ul>
			{ list.sort((a, b) => a.name == b.name ? 0 : (a.name < b.name ? -1: 1)).map(l => <li key={ l.id } className={ l.id == (this.props.selected || "") ? "selected": "" }><span className="link" onClick={ this.handler.bind(this) } data-target={ l.id }>{ l.name }</span></li>) }
		</ul>;
	}
}
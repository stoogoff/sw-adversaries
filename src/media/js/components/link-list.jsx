
import React from "react";
import dispatcher from "lib/dispatcher";
import { sortByProperty } from "lib/utils";
import * as CONFIG from "lib/config";

export default class LinkList extends React.Component {
	handler(evt) {
		var id = evt.target.getAttribute("data-target");

		dispatcher.dispatch(CONFIG.OBJECT_VIEW, id);
	}

	render() {
		let list = this.props.data;

		if(list == null) {
			return null;
		}

		return <ul>
			{ list.sort(sortByProperty("name")).map(l => {
				let isSelected = l.id == (this.props.selected || "");

				return <li key={ l.id } className={ isSelected ? "selected": "" }>
					<span className="link" onClick={ this.handler.bind(this) } data-target={ l.id }>{ isSelected ? <span className="fa fa-caret-right"></span> : null } { l.name }</span>
				</li>
			}) }
		</ul>;
	}
}
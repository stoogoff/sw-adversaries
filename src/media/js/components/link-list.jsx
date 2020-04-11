
import React from "react";
import dispatcher from "lib/dispatcher";
import { sortByProperty } from "lib/list";
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

		return <ul id="adversaries">
			{ list.sort(sortByProperty("name")).map(l => {
				let isSelected = l.id == (this.props.selected || "");
				let icon = null;

				if(l.favourite) {
					icon = <svg className="outline star-filled"><use xlinkHref="#icon-star-full"></use></svg>;
				}
				else if(l.tags.indexOf(CONFIG.ADVERSARY_TAG) != -1) {
					icon = <svg className="mine"><use xlinkHref="#icon-edit"></use></svg>;
				}
				else if(isSelected) {
					icon = <svg><use xlinkHref="#icon-circle-right"></use></svg>;
				}

				return <li key={ l.id } className={ isSelected ? "selected": "" }>
					<span className="link" onClick={ this.handler.bind(this) } data-target={ l.id }>{ icon } { l.name }</span>
				</li>
			}) }
		</ul>;
	}
}
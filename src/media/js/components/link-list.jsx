
import React from "react";
import dispatcher from "lib/dispatcher";
import { sortByProperty } from "lib/list";
import * as CONFIG from "lib/config";

export default class LinkList extends React.Component {
	handler(evt) {
		const id = evt.target.getAttribute("data-target");

		dispatcher.dispatch(CONFIG.OBJECT_VIEW, id);
	}

	render() {
		const list = this.props.data;

		if(list == null) {
			return null;
		}

		return <ul className="link-list">
			{ list.sort(sortByProperty("name")).map(l => {
				const isSelected = l.id == (this.props.selected || "");
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

				const source = l.tags.find(t => t.startsWith(CONFIG.SOURCE_TAG))
				const label = source !== `${CONFIG.SOURCE_TAG}Official` ? <span className="pill">{ source.replace(CONFIG.SOURCE_TAG, '') }</span> : null

				return <li key={ l.id } className={ isSelected ? "selected": "" }>
					<span className="link" onClick={ this.handler.bind(this) } data-target={ l.id }>{ icon } { l.name }</span>{ label }
				</li>
			}) }
		</ul>;
	}
}

import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { sortByProperty } from "lib/list";
import { id } from "lib/string";
import { book } from "lib/utils";

function titlecase(s) {
	return s[0].toUpperCase() + s.substring(1).toLowerCase();
}

export default class TagMenu extends React.Component {
	constructor(...args) {
		super(...args);

		this.listener = null;
		this.menu = {};
		this.state = {
			active: null
		};
	}

	componentWillReceiveProps(nextProps) {
		this.menu = {};

		nextProps.tags.forEach(tag => {
			let type = "tag";
			let text = tag;

			if(tag.indexOf(":") != -1) {
				[type, text] = tag.split(":");

				if(type == "book") {
					text = book(tag);
				}
			}

			if(!(type in this.menu)) {
				this.menu[type] = [];
			}				

			this.menu[type].push({
				text: text,
				tag: tag
			});
		});

		Object.keys(this.menu).forEach(m => this.menu[m].sort(sortByProperty("text")));
	}

	componentDidMount() {
		this.listener = document.addEventListener("click", () => {
			this.setState({
				active: null
			});
		}, false);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.listener);
	}

	handler(evt) {
		let tag = evt.target.getAttribute("data-href");

		if(tag.startsWith(CONFIG.FAVOURITE_KEY)) {
			dispatcher.dispatch(CONFIG.OBJECT_VIEW, id(tag.replace(CONFIG.FAVOURITE_KEY, "")));
		}
		else {
			dispatcher.dispatch(CONFIG.MENU_FILTER, tag.toLowerCase());
		}

		this.setState({
			active: null
		});
	}

	openMenu(evt) {
		evt.stopPropagation();
		evt.nativeEvent.stopImmediatePropagation();

		let oldActive = this.state.active;
		let newActive = evt.target.getAttribute("data-menu");

		this.setState({
			active: oldActive == newActive ? null : newActive
		});
	}

	render() {
		// the SVG icon needs to be moved to CSS
		// or put both in and the CSS can hide / show them appropriately
		return <div id="menu">
			<em>Star Wars: Adversaries</em>
			<ul>
			{ Object.keys(this.menu).sort().map(m => {
				return <li className={ this.state.active ==  m ? "active" : "" } key={ m }>
					<div data-menu={ m } onClick={ this.openMenu.bind(this) }>
						{ titlecase(m) }
						<svg className="down" data-menu={ m }><use xlinkHref="#icon-circle-down"></use></svg>
						<svg className="right" data-menu={ m }><use xlinkHref="#icon-circle-right"></use></svg>
					</div>
					<ul>
						{ this.menu[m].map(t => <li key={ t.tag }><span className="link" onClick={ this.handler.bind(this) } data-href={ t.tag }>{ t.text }</span></li>)}
					</ul>
				</li>;
			})}
			</ul>
		</div>;
	}
}
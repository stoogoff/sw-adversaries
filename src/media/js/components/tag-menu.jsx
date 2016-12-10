
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { sortByProperty, book } from "lib/utils";

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

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.tags.length != this.props.tags.length) {
			let tags = nextProps.tags;

			tags.forEach(tag => {
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
		dispatcher.dispatch(CONFIG.MENU_FILTER, evt.target.getAttribute("data-href").toLowerCase());

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
		return <ul id="menu">
			{ Object.keys(this.menu).sort().map(m => {
				return <li className={ this.state.active ==  m ? "active" : "" } key={ m }><div data-menu={ m } onClick={ this.openMenu.bind(this) }>{ titlecase(m) } <svg data-menu={ m }><use href="#icon-circle-down"></use></svg></div>
					<ul>
						{ this.menu[m].map(t => <li key={ t.tag }><span className="link" onClick={ this.handler.bind(this) } data-href={ t.tag }>{ t.text }</span></li>)}
					</ul>
				</li>;
			})}
		</ul>;
	}
}
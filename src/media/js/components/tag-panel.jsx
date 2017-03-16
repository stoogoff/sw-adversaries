
import React from "react";
import dispatcher from "lib/dispatcher";
import { book } from "lib/utils";
import * as CONFIG from "lib/config";

export default class TagPanel extends React.Component {
	handler(evt) {
		dispatcher.dispatch(CONFIG.MENU_FILTER, evt.target.getAttribute("data-href").toLowerCase());
	}

	render() {
		let keyed = [];
		let tags = [];

		this.props.data.sort().forEach(t => {
			if(t.indexOf(":") != -1) {
				let [key, value] = t.split(":");

				keyed.push({
					key: key.replace(/^([a-z])/, (match, s) => s.toUpperCase()),
					text: key == "book" ? book(t) : value,
					link: t
				});
			}
			else {
				tags.push(t);
			}
		});

		return <div className="info">
			<h2>{ this.props.title }</h2>
				{ keyed.length == 0 ? null :
					<div className="directory">
						{ keyed.map(k => <div key={ k.link }><strong>{ k.key }:</strong> <span className="link" onClick={ this.handler.bind(this) } data-href={ k.link }>{ k.text }</span></div>) }
					</div>
				 }
				{ tags.length == 0 ? <p>–</p> :
					<ul className="inline-list">
						{ tags.map((d, i) => <li key={ i }><span className="link" onClick={ this.handler.bind(this) } data-href={ d }>{ d }</span></li>) }
					</ul>
				}
		</div>;
	}
}
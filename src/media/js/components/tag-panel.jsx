
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class TagPanel extends React.Component {
	handler(evt) {
		dispatcher.dispatch(CONFIG.FILTER_MENU, evt.target.innerText);
	}

	render() {
		return <div className="info">
			<h2>{ this.props.title }</h2>
				{ this.props.data.length == 0 ? "–" :
					<ul className="inline-list">
						{ this.props.data.map((d, i) => <li key={ i }><span className="link" onClick={ this.handler.bind(this) }>{ d }</span></li>) }
					</ul>
				}
		</div>;
	}
}
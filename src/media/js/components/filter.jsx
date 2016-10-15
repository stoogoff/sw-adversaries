
import React from "react";
import dispatcher from "lib/dispatcher";

export default class Filter extends React.Component {
	constructor(...args) {
		super(...args);

		this.timer = null;

		this.state = {
			filter: ""
		};
	}

	clear() {
		this.setState({
			filter: ""
		});

		dispatcher.dispatch("filter-menu", "");
	}

	handler(evt) {
		this.setState({
			filter: evt.target.value
		});

		if(this.timer != null) {
			window.clearTimeout(this.timer);
		}

		this.timer = window.setTimeout(() => dispatcher.dispatch("filter-menu", this.state.filter), 250);
	}

	render() {
		return <div>
			<input type="text" onChange={ this.handler.bind(this) } value={ this.state.filter } /> <small className="link" onClick={ this.clear.bind(this) }>Clear</small>
		</div>
	}
}
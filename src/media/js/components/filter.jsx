
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class Filter extends React.Component {
	constructor(...args) {
		super(...args);

		this.timer = null;
		this.event = null;

		this.state = {
			filter: this.props.filter
		};
	}

	clear() {
		this.setState({
			filter: ""
		});

		dispatcher.dispatch(CONFIG.FILTER_MENU, "");
	}

	componentDidMount() {
		this.event = dispatcher.register(CONFIG.FILTER_MENU, filter => this.setState({  filter: filter }));
	}

	componentWillUnmount() {
		dispatcher.unregister(CONFIG.FILTER_MENU, this.event);
	}

	handler(evt) {
		this.setState({
			filter: evt.target.value
		});

		if(this.timer != null) {
			window.clearTimeout(this.timer);
		}

		this.timer = window.setTimeout(() => dispatcher.dispatch(CONFIG.FILTER_MENU, this.state.filter), 250);
	}

	render() {
		return <div className="filter">
			<input type="text" onChange={ this.handler.bind(this) } value={ this.state.filter } /> <small className="link" onClick={ this.clear.bind(this) }>Clear</small>
		</div>
	}
}
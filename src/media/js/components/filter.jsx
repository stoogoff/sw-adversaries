
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

		dispatcher.dispatch(CONFIG.MENU_FILTER, "");
	}

	componentDidMount() {
		this.event = dispatcher.register(CONFIG.MENU_FILTER, filter => this.setState({  filter: filter }));
	}

	componentWillUnmount() {
		dispatcher.unregister(CONFIG.MENU_FILTER, this.event);
	}

	handler(evt) {
		this.setState({
			filter: evt.target.value
		});

		if(this.timer != null) {
			window.clearTimeout(this.timer);
		}

		this.timer = window.setTimeout(() => dispatcher.dispatch(CONFIG.MENU_FILTER, this.state.filter), 250);
	}

	render() {
		return <div className="filter">
			<input type="text" onChange={ this.handler.bind(this) } value={ this.state.filter } />
			<span id="clear" onClick={ this.clear.bind(this) }><svg><use href="#icon-cancel-circle"></use></svg></span>
		</div>;
	}
}
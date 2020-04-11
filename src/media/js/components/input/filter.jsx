
import React from "react";
import { throttle } from "../../lib/timer";

export default class Filter extends React.Component {
	constructor(props) {
		super(props);

		this.update = throttle(this.callHandler.bind(this));
		this.state = {
			text: props.text
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.text !== this.props.text) {
			this.setState({
				text: nextProps.text
			});
		}
	}

	clear() {
		this.setState({
			text: ""
		});

		this.callHandler("");
	}

	callHandler(text) {
		if(this.props.handler) {
			this.props.handler(text);
		}
	}

	handler(evt) {
		let text = evt.target.value;

		this.setState({
			text: text
		});

		this.update(text);
	}

	render() {
		return <div className="filter">
			<input type="text" onChange={ this.handler.bind(this) } value={ this.state.text } />
			<span id="clear" onClick={ this.clear.bind(this) }><svg><use xlinkHref="#icon-cancel-circle"></use></svg></span>
		</div>;
	}
}

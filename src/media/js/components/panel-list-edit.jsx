
import React from "react";
import { parent, symbolise } from "lib/utils";

export default class PanelListEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			displayAddPanel: false
		};
	}

	toggleAddPanel() {
		this.setState({
			displayAddPanel: !this.state.displayAddPanel
		});
	}

	remove(evt) {
		let node = parent(evt.target, "div")

		if(node && this.props.remove) {
			let index = node.getAttribute("data-index");

			this.props.remove(index);
		}
	}

	render() {
		return <div className="edit-panel edit-list">
			<h2>{ this.props.title }</h2>
			{ this.props.list.map((item, index) => <div className="row-input" data-index={ index }>
					<span>{ item.name || item }</span>
					<svg className="delete" onClick={ this.remove.bind(this) }><use xlinkHref="#icon-delete"></use></svg>
				</div>
			)}
			{this.state.displayAddPanel
				? <div><span className="btn close" title="Close panel" onClick={ this.toggleAddPanel.bind(this) }><svg><use xlinkHref="#icon-cross"></use></svg> Close Panel</span> { this.props.children }</div>
				: <button className="btn-full" disabled={ this.state.displayAddPanel } onClick={ this.toggleAddPanel.bind(this) }>Add</button>
			}
		</div>;
	}
}
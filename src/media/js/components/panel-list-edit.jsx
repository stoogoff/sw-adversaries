
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
			{ this.props.list.map((item, index) => <div className="input-row" data-index={ index }>
					<span className="link">{ item.name || item }</span>
					<svg className="delete" onClick={ this.remove.bind(this) }><use xlinkHref="#icon-delete"></use></svg>
				</div>
			)}
			{this.state.displayAddPanel
				? this.props.children
				: <button className="btn" disabled={ this.state.displayAddPanel } onClick={ this.toggleAddPanel.bind(this) }>Add</button>
			}
		</div>;
	}
}
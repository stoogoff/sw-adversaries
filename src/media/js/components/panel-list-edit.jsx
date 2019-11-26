
import React from "react";
import { symbolise } from "lib/utils";

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
		let index = evt.target.parentNode.getAttribute("data-index");

		if(this.props.remove) {
			this.props.remove(index);
		}
	}

	render() {
		return <div className="edit-panel edit-list">
			<h2>{ this.props.title }</h2>
			{ this.props.list.map((item, index) => <div className="input-row">
					<span className="link">{ item.name || item }</span>
					<svg className="delete" data-index={ index } onClick={ this.remove.bind(this) }><use xlinkHref="#icon-delete"></use></svg>
				</div>
			)}
			{this.state.displayAddPanel
				? this.props.children
				: <button className="btn" disabled={ this.state.displayAddPanel } onClick={ this.toggleAddPanel.bind(this) }>Add</button>
			}
		</div>;
	}
}
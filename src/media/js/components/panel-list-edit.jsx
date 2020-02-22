
import React from "react";
import { parent } from "lib/dom";
import { symbolise } from "lib/utils";

export default class PanelListEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			displayAddPanel: false
		};
	}

	toggleAddPanel() {
		let newDisplay = !this.state.displayAddPanel;

		this.setState({
			displayAddPanel: newDisplay
		});

		// fire the close event if the sub-panel is now closed
		if(!newDisplay && this.props.onClose) {
			this.props.onClose();
		}
	}

	handler(type) {
		return (evt) => {
			let node = parent(evt.target, "div")

			if(node && this.props[type]) {
				let index = node.getAttribute("data-index");

				this.props[type](index);
			}
		};
	}

	edit(evt) {
		this.setState({
			displayAddPanel: true
		});

		this.handler("edit")(evt);
	}

	render() {
		const children = React.Children.map(this.props.children, child => React.cloneElement(child, { close: this.toggleAddPanel.bind(this) }));
		const list = this.props.list || [];

		return <div className="edit-panel edit-list">
			{ this.props.hideTitle ? null : <h2>{ this.props.title }</h2> }
			{ list.map((item, index) => <div className="row-input" data-index={ index }>
					{ item.name ? <span className="link" onClick={ this.edit.bind(this) }>{ item.name }</span> : <span>{ item }</span> }
					<svg className="delete" onClick={ this.handler("remove").bind(this) }><use xlinkHref="#icon-delete"></use></svg>
				</div>
			)}
			{this.state.displayAddPanel
				? <div><span className="btn close" title="Close panel" onClick={ this.toggleAddPanel.bind(this) }><svg><use xlinkHref="#icon-cross"></use></svg> Close Panel</span> { children }</div>
				: <button className="btn-full" disabled={ this.state.displayAddPanel } onClick={ this.toggleAddPanel.bind(this) }>Add { this.props.title }</button>
			}
		</div>;
	}
}
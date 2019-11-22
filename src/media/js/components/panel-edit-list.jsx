
import React from "react";
import { symbolise } from "lib/utils";

export default class PanelEditList extends React.Component {
	render() {
		return <div className="edit-panel edit-list">
			<h2>{ this.props.title }</h2>
			{ this.props.list.map(w => <div className="input-row"><span className="link">{ w.name || w }</span> <svg className="delete"><use xlinkHref="#icon-delete"></use></svg></div>)}
			<button className="btn">Add</button>
		</div>;
	}
}
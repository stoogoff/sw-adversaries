
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import LinkList from "components/link-list";


export default class PanelImportComplete extends React.Component {
	close() {
		dispatcher.dispatch(CONFIG.IMPORT_CANCEL);
	}

	render() {
		return <div className="screen">
			<h1>Import Complete</h1>
			<div className="edit-panel">
				<p>Successfully uploaded the following adversaries:</p>
				<LinkList data={ this.props.adversaries } />
			</div>
			<div className="row-buttons">
				<button className="btn btn-full" onClick={ this.close.bind(this) }>Close</button>
			</div>
		</div>;
	}
}

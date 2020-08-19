
import React from "react";
import Dropzone from "react-dropzone";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { after } from "lib/timer";


export default class PanelImport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			files: []
		};
	}

	cancel() {
		dispatcher.dispatch(CONFIG.IMPORT_CANCEL);
	}

	save() {
		dispatcher.dispatch(CONFIG.IMPORT_UPLOAD, this.state.files);
	}

	canSave() {
		return this.state.files.length > 0;
	}

	readFiles(files) {
		let readFiles = [];
		let callback = after(files.length, () => {
			this.setState({
				files: readFiles
			})
		});

		// TODO validation
		// 1. Is the file a text file? (preferably a JSON file)
		// 2. Does the file parse as JSON
		// 3. Does the file look like an SWA adversary file?

		files.forEach(f => {
			const reader = new FileReader();

			reader.onload = () => {
				readFiles.push({ ...f, contents: reader.result });

				callback();
			}

			reader.readAsText(f);
		});
	}

	render() {
		return <div className="screen">
			<h1>Import</h1>
			<div className="edit-panel">
				<Dropzone onDrop={ this.readFiles.bind(this) }>
				{ ({ getRootProps, getInputProps }) => (
					<div className="drop-zone" { ...getRootProps() }>
						<input { ...getInputProps() } />
						<p>Drop an SWA file here to upload or click to select one.</p>
						<div className="centred"><svg><use xlinkHref="#icon-upload"></use></svg></div>
					</div> )}
				</Dropzone>
			</div>
			<div className="edit-panel">
				<ul>
					{ this.state.files.map(f => <li>{ f.name }</li>) }
				</ul>
			</div>
			<div className="row-buttons">
				<button className="btn-save" disabled={ !this.canSave() } onClick={ this.save.bind(this) }>Save</button>
				<button className="btn-cancel" onClick={ this.cancel.bind(this) }>Cancel</button>
			</div>
		</div>;
	}
}
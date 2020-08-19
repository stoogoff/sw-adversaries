
import React from "react";
import Dropzone from "react-dropzone";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { after } from "lib/timer";


// error types
const ERROR_PARSE = 1;
const ERROR_FILE_TYPE = 2;
const ERROR_NOT_SWA = 4;



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
		dispatcher.dispatch(CONFIG.IMPORT_UPLOAD, this.state.files.filter(f => f.error === false));
	}

	canSave() {
		return this.state.files.length > 0 && this.state.files.filter(f => f.error === false).length > 0;
	}

	hasErrors() {
		return this.state.files.length > 0 && this.state.files.filter(f => f.error !== false).length > 0;
	}

	getErrorMessage(error) {
		switch(error) {
			case ERROR_PARSE:
				return "(corrupted JSON data)";
			case ERROR_FILE_TYPE:
				return "(wrong type of file)";
			case ERROR_NOT_SWA:
				return "(not an SWA compatible file)";
			default:
				return "(unknown error)";
		}
	}

	readFiles(files) {
		let readFiles = [];
		let callback = after(files.length, () => {
			this.setState({
				files: [...this.state.files, ...readFiles]
			})
		});

		// validation rules:
		//   1. Is the file a text file? (preferably a JSON file)
		//   2. Does the file parse as JSON
		//   3. Does the file look like an SWA adversary file?

		files.forEach(f => {
			const reader = new FileReader();

			reader.onload = () => {
				let file = {
					name: f.name,
					contents: null,
					error: false
				};

				// check it's a JSON file
				if(f.type === CONFIG.JSON_MIMETYPE) {
					// check for valid JSON
					try {
						file.contents = JSON.parse(reader.result);
					}
					catch {
						console.error(`JSON parsing error: ${f.name}.`);
						file.error = ERROR_PARSE;
					}
				}
				else {
					file.error = ERROR_FILE_TYPE;
				}

				// TODO check it's an SWA file and at least follows the structure

				readFiles.push(file);

				callback();
			}

			reader.readAsText(f);
		});
	}

	render() {
		return <div className="screen" id="import">
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
			{ this.hasErrors()
				? <div className="edit-panel error">
					<p>Some of the files uploaded have errors and will be skipped.</p>
				</div>
				: null
			}
			<div className="edit-panel">
				<ul className="file-list">
					{ this.state.files.map(f => <li className={ f.error ? "error" : null }>
						{ f.error ? <svg><use xlinkHref="#icon-warning"></use></svg> : null }
						{ f.name }
						{ f.error ? <small> { this.getErrorMessage(f.error) }</small> : null }
					</li>) }
				</ul>
			</div>
			<div className="row-buttons">
				<button className="btn-save" disabled={ !this.canSave() } onClick={ this.save.bind(this) }>Save</button>
				<button className="btn-cancel" onClick={ this.cancel.bind(this) }>Cancel</button>
			</div>
		</div>;
	}
}

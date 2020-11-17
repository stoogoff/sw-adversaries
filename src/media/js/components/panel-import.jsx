
import React from "react";
import Dropzone from "react-dropzone";
import LinkList from "components/link-list";
import RadioList from "./input/radiolist";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { after } from "lib/timer";
import * as Store from "lib/local-store";
import { pluck, intersectionByProperty, indexOfByProperty, sortByProperty, findByProperty } from "lib/list";
import { parseXML } from "lib/oggdude"


// error types
const ERROR_PARSE = 1;
const ERROR_FILE_TYPE = 2;
const ERROR_NOT_SWA = 3;

// screen types
const SCREEN_UPLOAD = 1;
const SCREEN_COMPLETE = 2;
const SCREEN_CONFLICT = 3;

// whether an adversary is from the import file or local storage
const SOURCE_LOCAL = "local";
const SOURCE_IMPORT = "import";

// what to do with conflicts
const CONFLICT_SKIP = 0;
const CONFLICT_REPLACE = 1;
const CONFLICT_KEEP = 2;


// notify the app that the import is closing
const close = () => {
	dispatcher.dispatch(CONFIG.IMPORT_CLOSE);
};

// get an error message string based on the type of error
const getErrorMessage = (error) => {
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


// the main component which handles the current state, loads relevent child components and notifies the app on completion
// props:
// 	skills
export default class PanelImport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			files: [],
			screen: SCREEN_UPLOAD,
			adversaries: [], // adversaries which are ready for importing
			imported: [], // imported adversaries which clash with a stored adversary
			stored: [] // stored adversaries which clash with an imported adversary
		};
	}

	// conflicted is a hash like this: { id1: 0, id2: 1 }
	// where the number is one of the CONFLICT_* constants
	mergeAndSave(conflicted) {
		// remove any adversaries which are in the conflicted hash with the supplied state
		const filter = state => a => {
			if(a.id in conflicted) {
				 return conflicted[a.id] != state;
			}

			return true;
		} 

		let adversaries = this.getImportedAdversaries().filter(filter(CONFLICT_SKIP));
		let stored = (Store.local.get(CONFIG.ADVERSARY_STORE) || []).filter(filter(CONFLICT_REPLACE));

		// change the id of an adversary which is being kept along with the stored version
		adversaries.forEach(a => {
			if(a.id in conflicted && conflicted[a.id] == CONFLICT_KEEP) {
				a.id = a.id + "-import";
			}
		});

		this.save(stored, adversaries);
	}

	// check for clashing ids in the import data with existing local store
	// if there aren't call save()
	// if there are some display the conflict screen
	checkAndSave() {
		let newAdversaries = this.getImportedAdversaries();
		let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];

		// check for conflicts, this creates an array of adversaries which appear in both the import and storage (marked with where they came from)
		// conflicts are by matching ID only, as that will break the system
		let conflictImport = intersectionByProperty(newAdversaries, stored, "id").map(a => ({ ...a, source: SOURCE_IMPORT }));
		let conflictLocal = intersectionByProperty(stored, newAdversaries, "id").map(a => ({ ...a, source: SOURCE_LOCAL }));

		// TODO if the clashing objects are IDENTICAL then just ignore this

		// there are clashes (matching ids) between the uploaded and existing adversaries
		if(conflictImport.length) {
			this.setState({
				imported: conflictImport.sort(sortByProperty("id")),
				stored: conflictLocal.sort(sortByProperty("id")),
				screen: SCREEN_CONFLICT
			});
		}
		else {
			this.save(stored, newAdversaries);
		}
	}

	getImportedAdversaries() {
		// files have a contents property which is an array of adversaries
		// flatten them all out
		return pluck(this.state.files.filter(f => f.error === false), "contents").flat();
	}

	// save new adversaries to local storage
	// let the app know this has happened
	save(stored, imported) {
		Store.local.set(CONFIG.ADVERSARY_STORE, [...stored, ...imported]);

		dispatcher.dispatch(CONFIG.IMPORT_UPLOAD, imported);

		this.setState({
			adversaries: imported,
			screen: SCREEN_COMPLETE
		});
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
		//   3. TODO Does the file look like an SWA adversary file?

		files.forEach(f => {
			const reader = new FileReader();

			reader.onload = () => {
				let file = {
					name: f.name,
					contents: null,
					mimetype: null,
					error: false
				};

				file.mimetype = f.type;

				// check it's a JSON file
				if(f.type === CONFIG.MIMETYPE_JSON) {
					// check for valid JSON
					try {
						file.contents = JSON.parse(reader.result);
					}
					catch {
						console.error(`JSON parsing error: ${f.name}.`);
						file.error = ERROR_PARSE;
					}
				}
				else if(f.type === CONFIG.MIMETYPE_XML) {
					try {
						console.log(parseXML(reader.result, this.props.skills, this.props.talents))
					}
					catch(err) {
						console.error(`XML parsing error: ${f.name}.`);
						console.error(err)
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
		switch(this.state.screen) {
			case SCREEN_COMPLETE:
				return <Complete adversaries={ this.state.adversaries } />;

			case SCREEN_CONFLICT:
				return <Conflict imported={ this.state.imported } stored={ this.state.stored } save={ this.mergeAndSave.bind(this) } />;

			case SCREEN_UPLOAD:
			default:
				return <Upload files={ this.state.files } onDrop={ this.readFiles.bind(this) } save={ this.checkAndSave.bind(this) } />;
		}
	}
}


// upload file screen
const Upload = props => {
	const hasErrors = () => {
		return props.files.length > 0 && props.files.filter(f => f.error !== false).length > 0;
	};

	const canSave = () => {
		return props.files.length > 0 && props.files.filter(f => f.error === false).length > 0;
	};

	return <div className="screen" id="import">
		<h1>Import</h1>
		<div className="edit-panel">
			<Dropzone onDrop={ props.onDrop }>
			{ ({ getRootProps, getInputProps }) => (
				<div className="drop-zone" { ...getRootProps() }>
					<input { ...getInputProps() } />
					<p>Drop an SWA file here to upload or click to select one.</p>
					<div className="centred"><svg><use xlinkHref="#icon-upload"></use></svg></div>
				</div> )}
			</Dropzone>
		</div>
		{ hasErrors()
			? <div className="edit-panel error">
				<p>Some of the files uploaded have errors and will be skipped.</p>
			</div>
			: null
		}
		<div className="edit-panel">
			<ul className="file-list">
				{ props.files.map(f => <li className={ f.error ? "error" : null }>
					{ f.error ? <svg><use xlinkHref="#icon-warning"></use></svg> : null }
					{ f.name }
					{ f.error ? <small> { getErrorMessage(f.error) }</small> : null }
				</li>) }
			</ul>
		</div>
		<div className="row-buttons">
			<button className="btn-save" disabled={ !canSave() } onClick={ props.save }>Save</button>
			<button className="btn-cancel" onClick={ close }>Cancel</button>
		</div>
	</div>;
};


// complete successfully screen
const Complete = props => (
	<div className="screen">
		<h1>Import Complete</h1>
		<div className="edit-panel">
			{ props.adversaries.length
				? <div>
					<p>Successfully uploaded the following adversaries:</p>
					<LinkList data={ props.adversaries } />
				</div>
				: <p>No adversaries have been imported.</p>
			}
		</div>
		<div className="row-buttons">
			<button className="btn btn-full" onClick={ close }>Close</button>
		</div>
	</div>
);


class Conflict extends React.Component {
	constructor(props) {
		super(props);

		let checkState = {};

		props.imported.forEach(a => checkState[a.id] = CONFLICT_SKIP);

		this.state = {
			checkState
		};
	}

	checkStateHander(adversaryId, checkIndex) {
		let checkState = this.state.checkState;

		checkState[adversaryId] = checkIndex;

		this.setState({
			checkState
		});
	}

	save() {
		if(this.props.save) {
			this.props.save(this.state.checkState);
		}
	}

	getLabel(adversary) {
		return <span>{ adversary.name } <small>({ "modified" in adversary ? new Date(adversary.modified).toLocaleString() : "unknown" })</small></span>;
	}

	render() {
		// props:
		// imported
		// stored
		let checkList = this.props.imported.map((advImport, idx) => (
			<tr>
				<td>{ this.getLabel(advImport) }</td>
				<td>
					<RadioList labels={ ["Skip", "Replace", "Keep Both"] } checkedIndex={ this.state.checkState[advImport.id] } handler={ this.checkStateHander.bind(this, advImport.id)} />
				</td>
				<td>{ this.getLabel(this.props.stored[idx]) }</td>
			</tr>
		));

		return <div className="screen">
			<h1>Import Conflict</h1>
			<div className="edit-panel">
				<p>Some of the imported adversaries are already stored locally and are listed below. Do you want to skip the import, replace the stored copy, or keep both?</p>
				<table>
					<thead>
						<tr>
							<th>Imported</th>
							<th></th>
							<th>Local</th>
						</tr>
					</thead>
					<tbody>
						{ checkList }
					</tbody>
				</table>
			</div>
			<div className="row-buttons">
				<button className="btn-save" onClick={ this.save.bind(this) }>Save</button>
				<button className="btn-cancel" onClick={ close }>Cancel</button>
			</div>
		</div>;
	}
}

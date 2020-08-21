
import React from "react";
import Dropzone from "react-dropzone";
import LinkList from "components/link-list";
import Checkbox from "./input/checkbox";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { after } from "lib/timer";
import * as Store from "lib/local-store";
import { pluck, intersectionByProperty, indexOfByProperty, sortByProperty, findByProperty } from "lib/list";

// TODO maybe the merge section should follow the file system options. You either stop, keep or replace
// the UI would need to change
// could be something like IMPORT on right of row LOCAL on left
// with Skip, Replace, Keep Both buttons
// BASICALLY it shouldn't be possible to delete an adversary through import because it's weird behaviour
// it should keep one or both of the conflict, not neither


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
export default class PanelImport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			files: [],
			screen: SCREEN_UPLOAD,
			adversaries: []
		};
	}

	mergeAndSave(toKeep, toDelete) {
		// toKeep local - do nothing
		// toKeep import - update id so it doesn't clash
		// toDelete local - remove
		// toDelete import - remove

		const remove = (list, filterList) => {
			return list.filter(f => indexOfByProperty(filterList, "id", f.id) == -1);
		};
console.log("toDelete", toDelete)
		// get the new adversaries and remove any which are in the toDeleteImport array
		// same for stored with the toDeleteLocal array
		let newAdversaries = remove(this.getImportedAdversaries(), toDelete.filter(f => f.source === SOURCE_IMPORT));
		let stored = remove(Store.local.get(CONFIG.ADVERSARY_STORE) || [], toDelete.filter(f => f.source === SOURCE_LOCAL));

		// check the ids of everything in to keep, create a new id for the import if there are still clashes
		let keepById = {};

		toKeep.forEach(a => {
			if(!(a.id in keepById)) {
				keepById[a.id] = 0;
			}

			++keepById[a.id];
		});

		Object.keys(keepById).forEach(id => {
			// there are multiple, so find the one in the import and change its id
			if(keepById[id] > 1) {
				let toUpdate = newAdversaries.find(findByProperty("id", id));
				
				toUpdate.id = id + "-import";
			}
		});

		this.save([...stored, ...newAdversaries]);
	}

	// check for clashing ids in the import data with existing local store
	// if there aren't call save()
	// if there are some display the conflict screen
	checkAndSave() {
		let newAdversaries = this.getImportedAdversaries();
		let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];

		// check for clashes, this creates an array of adversaries which appear in both the import and storage (marked with where they came from)
		// clashes are by matching ID only, as that will break the system
		let clashes = [
			...intersectionByProperty(newAdversaries, stored, "id").map(a => ({ ...a, source: SOURCE_IMPORT })),
			...intersectionByProperty(stored, newAdversaries, "id").map(a => ({ ...a, source: SOURCE_LOCAL }))
		];

		// TODO if the clashing objects are IDENTICAL then just ignore this

		// there are clashes (matching ids) between the uploaded and existing adversaries
		if(clashes.length) {
			this.setState({
				adversaries: clashes.sort(sortByProperty("id")),
				screen: SCREEN_CONFLICT
			});
		}
		else {
			this.save([...stored, ...newAdversaries]);
		}
	}

	getImportedAdversaries() {
		// files have a contents property which is an array of adversaries
		// flatten them all out
		return pluck(this.state.files.filter(f => f.error === false), "contents").flat();
	}

	// resave adversaries to local storage - this includes the existing ones and the imported ones
	// let the app know this has happened
	save(adversaries) {
		Store.local.set(CONFIG.ADVERSARY_STORE, adversaries);

		dispatcher.dispatch(CONFIG.IMPORT_UPLOAD, adversaries);

		this.setState({
			adversaries: adversaries,
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
		switch(this.state.screen) {
			case SCREEN_COMPLETE:
				return <Complete adversaries={ this.state.adversaries } />;

			case SCREEN_CONFLICT:
				return <Conflict adversaries={ this.state.adversaries } save={ this.mergeAndSave.bind(this) } />;

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
	// TODO due to the merge / conflict code nothing may be imported
	<div className="screen">
		<h1>Import Complete</h1>
		<div className="edit-panel">
			<p>Successfully uploaded the following adversaries:</p>
			<LinkList data={ props.adversaries } />
		</div>
		<div className="row-buttons">
			<button className="btn btn-full" onClick={ close }>Close</button>
		</div>
	</div>
);


class Conflict extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: {}
		};
	}

	tmpId(adversary) {
		return `${adversary.source}-${adversary.id}`;
	}

	clickHandler(adversary) {
		const id = this.tmpId(adversary);
		let selected = this.state.selected;

		selected[id] = !this.isChecked(adversary);

		this.setState({
			selected
		});
	}

	isChecked(adversary) {
		const id = this.tmpId(adversary);

		return id in this.state.selected && this.state.selected[id] === true;
	}

	save() {
		if(this.props.save) {
			let selected = this.state.selected;
			let available = this.props.adversaries;
			let toKeep = [], toDelete = [];

			available.forEach(adversary => {
				const id = this.tmpId(adversary);

				(selected[id] ? toKeep : toDelete).push(adversary);
			});

			this.props.save(toKeep, toDelete);
		}
	}

	render() {
		const checkList = this.props.adversaries.map(c => {
			// TODO add something to distinguish local / imported
			// TODO the UI should tell you when you're removing any items from local
			const label = <span>{ c.source.toUpperCase() + ": " + c.name } <small>({ "modified" in c ? new Date(c.modified).toLocaleString() : "unknown" })</small></span>;
			const id = this.tmpId(c);

			return <Checkbox label={ label } object={ c } checked={ this.isChecked(c)  } handler={ this.clickHandler.bind(this) } />;
		});

		return <div className="screen">
			<h1>Import Conflict</h1>
			<div className="edit-panel">
				<p>Some of the imported adversaries are already stored locally. Select which ones you want to keep from the list below:</p>
				{ checkList }
			</div>
			<div className="row-buttons">
				<button className="btn-save" onClick={ this.save.bind(this) }>Save</button>
				<button className="btn-cancel" onClick={ close }>Cancel</button>
			</div>
		</div>;
	}
}

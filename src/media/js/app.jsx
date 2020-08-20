
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Tab from "lib/tab";
import CharacterView from "components/character-view";
import CharacterEdit from "components/character-edit";
import PanelImport from "components/panel-import";
import LinkList from "components/link-list";
import Filter from "components/input/filter";
import Loader from "components/loader";
import Tabs from "components/tabs";
import TagMenu from "components/tag-menu";
import * as Store from "lib/local-store";
import { sortByProperty, findByProperty, unique } from "lib/list";
import * as CONFIG from "lib/config";


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			selectedIndex: 0,
			list: null,
			filter: "",
			tags: [],
			isLoaded: false,
			menuOpen: false,
			showAbout: false,
			mode: CONFIG.MODE_IMPORT,//CONFIG.MODE_NORMAL,
			editAdversary: null,
			canExport: Store.local.has(CONFIG.ADVERSARY_STORE) ? Store.local.get(CONFIG.ADVERSARY_STORE).length > 0 : false,
			uploadedAdversaries: null
		};
		this.events = {};
		this.stores = {};
		this.loadedTotal = 0;

		["skills", "adversaries", "vehicles", "weapons", "talents", "qualities"].forEach(key => {
			this.stores[key] = new DataStore(`${ENV_VERSION}/media/data/${key}.json`);
			this.stores[key].load(() => this.loadedTotal++);
		});
	}

	componentDidMount() {
		this.events["adversaries"] = this.stores.adversaries.on("change", () => {
			let adversaries = this.stores.adversaries.all();
			let adversary = null;

			// load up stored adversaries and either replace them or add them
			let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];
			let ids = stored.map(a => a.id);

			adversaries = adversaries.filter(a => ids.indexOf(a.id) == -1);

			stored.filter(a => a.id).forEach(a => adversaries.push(a));

			let favourites = Store.local.get(CONFIG.FAVOURITE_STORE) || [];
			let tags = ["minion", "rival", "nemesis"];

			adversaries.forEach(a => {
				if(favourites.indexOf(a.id) != -1) {
					a.favourite = true;
					a.tags.push(CONFIG.FAVOURITE_TAG);

					tags.push(CONFIG.FAVOURITE_KEY + a.name);
				}

				if(a.tags == null) {
					a.tags = [];
				}
				else {
					tags.push(...a.tags);
				}

				a.tags.push(a.type.toLowerCase());

				a.tags = unique(a.tags);
			});

			tags = unique(tags);

			if(location.hash.length > 0) {
				let id = location.hash.substring(1);

				adversary = adversaries.find(findByProperty("id", id));
			}

			if(!adversary) {
				adversary = adversaries.sort(sortByProperty("name"))[0];
			}

			this.stores.adversaries.data = adversaries;

			this.setState({
				list: adversaries,
				tags: tags
			});
			this.selectAdversary(adversary);
			this.setLoaded();
		});

		this.events["skills"] = this.stores.skills.on("change", () => {
			let skills = this.stores.skills.all();

			// load up stored skills and either replace them or add them
			let stored = Store.local.get(CONFIG.SKILL_STORE) || [];
			let names = stored.map(a => a.name);

			skills = skills.filter(a => names.indexOf(a.name) == -1);

			stored.filter(a => a.name).forEach(a => skills.push(a));

			this.stores.skills.data = skills.sort(sortByProperty("name"));
			this.setLoaded();
		});

		Object.keys(this.stores).forEach(key => {
			if(key != "adversaries" && key != "skills") {
				this.events[key] = this.stores[key].on("change", () => this.setLoaded());
			}
		});

		// view object from menu
		dispatcher.register(CONFIG.OBJECT_VIEW, id => {
			this.setState({ menuOpen: false, mode: CONFIG.MODE_NORMAL });
			this.selectAdversary(this.stores.adversaries.findBy("id", id));
		});

		// add another object to the view
		dispatcher.register(CONFIG.TAB_ADD, () => {
			let adversary = this.state.selected[this.state.selectedIndex].character;
			let selected = this.state.selected;

			selected.push(new Tab(adversary));

			this.setState({ selected: selected });
		});

		// remove the tab specified by the index
		dispatcher.register(CONFIG.TAB_REMOVE, index => {
			if(index < 0 || this.state.selected.length <= 1) {
				return;
			}

			let selectedIndex = this.state.selectedIndex;
			let selected = this.state.selected;

			selected.splice(index, 1);

			if(this.state.selectedIndex > this.state.selected.length - 1) {
				--selectedIndex;
			}

			this.setState({
				selected: selected,
				selectedIndex: selectedIndex
			});
		});

		let updateTab = property => {
			return (index, text) => {
				if(index < 0 || index >= this.state.selected.length) {
					return;
				}

				let selected = this.state.selected;

				selected[index][property] = text;

				this.setState({ selected: selected });
			}
		}

		// rename a given tab
		dispatcher.register(CONFIG.TAB_RENAME, updateTab("tabName"));

		// change the background colour of a given tab
		dispatcher.register(CONFIG.TAB_COLOUR, updateTab("colour"));

		// change to a new tab
		dispatcher.register(CONFIG.TAB_CHANGE, index => {
			if(index < 0 || index >= this.state.selected.length) {
				return;
			}

			this.setState({ selectedIndex: index });
		});

		// filter text from menu
		dispatcher.register(CONFIG.MENU_FILTER, filter => {
			this.filter(filter);
		});

		// add and remove favourites
		dispatcher.register(CONFIG.FAVOURITE_ADD, id => {
			let favourites = Store.local.has(CONFIG.FAVOURITE_STORE) ? Store.local.get(CONFIG.FAVOURITE_STORE) : [];

			if(favourites.indexOf(id) == -1) {
				let adversary = this.stores.adversaries.findBy("id", id);

				adversary.favourite = true;
				adversary.tags.push(CONFIG.FAVOURITE_TAG);

				let tags = this.state.tags;

				tags.push(CONFIG.FAVOURITE_KEY + adversary.name);
				favourites.push(id);

				Store.local.set(CONFIG.FAVOURITE_STORE, favourites);

				this.setState({ tags: tags });
				this.selectAdversary(adversary);
			}
		});
		dispatcher.register(CONFIG.FAVOURITE_REMOVE, id => {
			let favourites = Store.local.has(CONFIG.FAVOURITE_STORE) ? Store.local.get(CONFIG.FAVOURITE_STORE) : [];
			let index = favourites.indexOf(id);

			if(index != -1) {
				favourites.splice(index, 1);

				let adversary = this.stores.adversaries.findBy("id", id);

				adversary.favourite = false;
				adversary.tags.splice(adversary.tags.indexOf(CONFIG.FAVOURITE_TAG), 1);

				let tags = this.state.tags;

				tags.splice(tags.indexOf(CONFIG.FAVOURITE_KEY + adversary.name), 1);

				Store.local.set(CONFIG.FAVOURITE_STORE, favourites);

				this.setState({ tags: tags });
				this.selectAdversary(adversary);
			}
		});

		// add, edit, and delete custom adversaries
		dispatcher.register(CONFIG.ADVERSARY_ADD, () => {
			this.setState({ mode: CONFIG.MODE_EDIT, editAdversary: {} });
		});
		dispatcher.register(CONFIG.ADVERSARY_COPY, id => {
			// make a clone of the character for editing purposes
			let adversary = this.stores.adversaries.findBy("id", id);

			this.setState({ mode: CONFIG.MODE_EDIT, editAdversary: adversary });
		});
		dispatcher.register(CONFIG.ADVERSARY_CANCEL, () => {
			this.setState({
				mode: CONFIG.MODE_NORMAL,
				editAdversary: null
			});
		});
		dispatcher.register(CONFIG.ADVERSARY_SAVE, adversary => {
			let tags = this.state.tags;

			// store the modified date
			adversary.modified = Date.now();

			// add a tag to indicate that it's user defined
			if(adversary.tags.indexOf(CONFIG.ADVERSARY_TAG) == -1) {
				adversary.tags.push(CONFIG.ADVERSARY_TAG);

				if(tags.indexOf(CONFIG.ADVERSARY_TAG) == -1) {
					tags.push(CONFIG.ADVERSARY_TAG);
				}
			}

			// add the adversary's type as a tag
			let type = adversary.type.toLowerCase();

			if(adversary.tags.indexOf(type) == -1) {
				adversary.tags.push(type);
			}

			// clean up empty arrays
			["weapons", "talents", "abilities"].forEach(key => {
				if(key in adversary && adversary[key].length === 0) {
					delete adversary[key];
				}
			})

			// save it to local storage
			let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];

			stored = stored.filter(d => d.id != adversary.id);

			stored.push(adversary);

			Store.local.set(CONFIG.ADVERSARY_STORE, stored);

			// update the data store
			let adversaries = this.stores.adversaries.all().filter(a => a.id != adversary.id);

			adversaries.push(adversary);

			this.stores.adversaries.data = adversaries;

			this.setState({
				mode: CONFIG.MODE_NORMAL,
				editAdversary: null,
				tags: tags,
				canExport: true
			});

			this.selectAdversary(adversary);
		});
		dispatcher.register(CONFIG.ADVERSARY_DELETE, id => {
			this.stores.adversaries.data = this.stores.adversaries.filter(f => f.id != id);

			// remove from local store
			let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];

			stored = stored.filter(d => d.id != id);

			Store.local.set(CONFIG.ADVERSARY_STORE, stored);

			// remove from filtered navigation list
			let list = this.state.list.filter(f => f.id != id);

			if(list.length === 0) {
				// empty list so remove the filter
				list = this.stores.adversaries.all();

				dispatcher.dispatch(CONFIG.MENU_FILTER, "");
			}

			// update tags in case there are no more characters with the ADVERSARY_TAG tag
			let tags = unique(this.stores.adversaries.map(a => a.tags).flat());

			this.setState({
				mode: CONFIG.MODE_NORMAL,
				editAdversary: null,
				selected: this.state.selected,
				list: list,
				tags: tags,
				canExport: stored.length > 0
			});

			this.selectAdversary(list[0]);
		});

		// add customm skills
		dispatcher.register(CONFIG.SKILL_ADD, skill => {
			this.stores.skills.data = this.stores.skills.filter(f => f.name != skill.name);
			this.stores.skills.push(skill);

			// save it to local storage
			let stored = Store.local.get(CONFIG.SKILL_STORE) || [];

			stored = stored.filter(d => d.name != skill.name);

			stored.push(skill);

			Store.local.set(CONFIG.SKILL_STORE, stored);
		});

		// export data
		dispatcher.register(CONFIG.EXPORT, () => {
			let stored = Store.local.get(CONFIG.ADVERSARY_STORE) || [];

			if(stored && stored.length) {
				// add a modified timestamp if one doesn't exist
				stored = stored.map(s => ({ modified: Date.now(), ...s }));

				let url = URL.createObjectURL(new Blob([JSON.stringify(stored)], { type: CONFIG.JSON_MIMETYPE }));
				let link = document.createElement("a");

				link.setAttribute("href", url);
				link.setAttribute("download", "swa-data.json");
				link.click();
			}
		});

		// open import screen
		dispatcher.register(CONFIG.IMPORT, () => {
			this.setState({
				mode: CONFIG.MODE_IMPORT
			});
		});

		// close import screen and cancel importing data
		dispatcher.register(CONFIG.IMPORT_CLOSE, () => {
			this.setState({
				mode: CONFIG.MODE_NORMAL
			});
		});

		// the import screens handle adding and deleting from local storage
		// so 
		dispatcher.register(CONFIG.IMPORT_UPLOAD, newAdversaries => {
			// TODO there's possibly some deleting of existing stored adversaries
			// TODO if the adversary tag is currently filtered, this adversary should be added to the list
			// TODO this now duplicates the exist stored data

			// update the existing adversaries
			this.stores.adversaries.data = [...this.stores.adversaries.data, ...newAdversaries];

			// add the mine tag if it doesn't exist
			let tags = this.state.tags;

			if(tags.indexOf(CONFIG.ADVERSARY_TAG) == -1) {
				tags = [...tags, CONFIG.ADVERSARY_TAG];
			}


			this.setState({
				tags: tags,
				uploadedAdversaries: newAdversaries,
			});
		});
	}

	toggleMenu() {
		this.setState({ menuOpen: !this.state.menuOpen });
	}

	setLoaded() {
		this.setState({ isLoaded: this.loadedTotal == Object.keys(this.stores).length });
	}

	selectAdversary(adversary) {
		let selected = this.state.selected;

		selected[this.state.selectedIndex] = new Tab(adversary);

		this.setState({ selected: selected });

		if(this.state.selected.length > 0) {
			location.hash = this.state.selected[this.state.selectedIndex].character.id;
		}
	}

	toggleAbout() {
		this.setState({ showAbout: !this.state.showAbout });
	}

	componentWillUnmount() {
		Object.keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	// filter text from menu
	filter(text) {
		let adversaries = this.stores.adversaries.all();

		if(text != "") {
			text = text.toLowerCase();

			adversaries = adversaries.filter(a => a.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(text) != -1 || a.tags.find(t => t.toLowerCase() == text) != undefined);
		}

		this.setState({ list: adversaries, filter: text });

		if(adversaries.length == 1) {
			this.setState({ menuOpen: false });
			this.selectAdversary(adversaries[0]);
		}
	}

	render() {
		let x = this.state.list != null ? this.state.list.length : 0;
		let y = this.stores.adversaries != null ? this.stores.adversaries.all().length : 0;
		let overlay = this.state.showAbout ?
			<div className="overlay">
				<div className="panel">
					<h3>About</h3>
					<p>Star Wars Adversaries is an easily searchable database of adversaries for <a href="https://www.fantasyflightgames.com/">Fantasy Flight Games’</a> Star Wars Roleplaying Game.</p>
					<p>Built by <a href="http://www.stoogoff.com/">Stoo Goff</a>, <a href="https://twitter.com/nlx3647">nlx3647</a>, and <a href="https://github.com/SkyJed">SkyJedi</a>.</p>
					<p>Want to support the future development of <em>Star Wars: Adversaries</em>? Checkout my other RPG products on <a href="https://www.drivethrurpg.com/browse/pub/14996/we-evolve">DriveThruRPG</a> or <a href="https://we-evolve.itch.io/">itch.io</a> or use the button below to donate.</p>
					<div id="donation"><a href="https://paypal.me/weevolve" target="_blank" className="btn">Donate</a></div>
					<div className="btn pull-right" onClick={ this.toggleAbout.bind(this) }><svg><use xlinkHref="#icon-cross"></use></svg> <span>Close</span></div>
				</div>
			</div>
			: null;

		let builtBy = <span><span className="link" onClick={ this.toggleAbout.bind(this) }>About</span> | <a href="https://github.com/stoogoff/sw-adversaries">Source</a></span>;

		let content = [<div>
			{ this.state.selected.map((selected, index) => <CharacterView key={ index } character={ selected.character } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } qualities={ this.stores.qualities } vehicles={ this.stores.vehicles } visible={ index == this.state.selectedIndex } />)}
			<Tabs tabs={ this.state.selected } selectedIndex={ this.state.selectedIndex } />
		</div>];

		// add modal overlays to the rendered components
		switch(this.state.mode) {
			case CONFIG.MODE_EDIT:
				content.push(<div className="overlay"><CharacterEdit character={ this.state.editAdversary } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } tags={ this.state.tags } qualities={ this.stores.qualities } /></div>);
				break;
			case CONFIG.MODE_IMPORT:
				content.push(<div className="overlay"><PanelImport /></div>);
				break;
		}

		return <div>
			{ overlay }
			<div id="mobile-menu">
				<span className="btn" onClick={ this.toggleMenu.bind(this) }><svg><use xlinkHref="#icon-menu"></use></svg></span>
				<em>Star Wars: Adversaries</em>
				{ builtBy }
			</div>
			<div id="navigation" className={ (this.state.menuOpen ? "menu-open" : "menu-closed") + " column small" }>
				<TagMenu canExport={ this.state.canExport } tags={ this.state.tags } />
				<Filter text={ this.state.filter } handler={ this.filter.bind(this) } />
				<p><small>Showing { x } of { y }.</small></p>
				<div id="adversaries"><LinkList data={ this.state.list } selected={ this.state.selected.length > 0 ? this.state.selected[this.state.selectedIndex].character.id : "" } /></div>
			</div>
			<div id="content" className="column large">
				{ !this.state.isLoaded
					? <Loader />
					: content
				}
			</div>
			<div id="built-by">{ builtBy }</div>
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
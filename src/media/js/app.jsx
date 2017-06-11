
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Character from "components/character";
import LinkList from "components/link-list";
import Filter from "components/filter";
import Loader from "components/loader";
import Tabs from "components/tabs";
import TagMenu from "components/tag-menu";
import * as Store from "lib/local-store";
import { sortByProperty } from "lib/utils";
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
			menuOpen: false
		};
		this.events = {};
		this.stores = {};
		this.loadedTotal = 0;

		["skills", "adversaries", "weapons", "talents", "qualities"].forEach(key => {
			this.stores[key] = new DataStore(`media/data/${key}.json`);
			this.stores[key].load(() => this.loadedTotal++);
		});
	}

	componentDidMount() {
		this.events["adversaries"] = this.stores.adversaries.on("change", () => {
			let adversaries = this.stores.adversaries.all();
			let adversary = null;

			if(location.hash.length > 0) {
				let id = location.hash.substring(1);

				adversary = this.stores.adversaries.findBy("id", id);
			}

			if(!adversary) {
				adversary = adversaries.sort(sortByProperty("name"))[0];
			}

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
					a.tags.forEach(t => {
						if(tags.indexOf(t) == -1) {
							tags.push(t);
						}
					});
				}

				a.tags.push(a.type.toLowerCase());
			});

			this._updateState(adversary, adversaries, null, tags);
		});

		Object.keys(this.stores).forEach(key => {
			if(key != "adversaries") {
				this.events[key] = this.stores[key].on("change", () => this._updateState());
			}
		});

		// view object from menu
		dispatcher.register(CONFIG.OBJECT_VIEW, id => {
			this._updateState(this.stores.adversaries.findBy("id", id), null, null, null, false);
		});

		// add another object to the view
		dispatcher.register(CONFIG.TAB_ADD, () => {
			let newTab = this.stores.adversaries.all().find(a => a.id == this.state.selected[this.state.selectedIndex].id);

			this.state.selected.push(newTab);
			this._updateState();
		});

		// remove the first non-active tab from the right hand side
		dispatcher.register(CONFIG.TAB_REMOVE, () => {
			for(let i = this.state.selected.length - 1; i >= 0; --i) {
				if(i != this.state.selectedIndex) {
					this.state.selected.splice(i, 1);

					if(i < this.state.selectedIndex) {
						--this.state.selectedIndex;
					}

					this._updateState();

					break;
				}
			}
		});

		// change to a new tab
		dispatcher.register(CONFIG.TAB_CHANGE, index => {
			this.state.selectedIndex = index;
			this._updateState();
		});

		// filter text from menu
		dispatcher.register(CONFIG.MENU_FILTER, filter => {
			let adversaries = this.stores.adversaries.all();

			if(filter != "") {
				filter = filter.toLowerCase();

				adversaries = adversaries.filter(a => a.name.toLowerCase().indexOf(filter) != -1 || a.tags.find(t => t.toLowerCase() == filter) != undefined);
			}

			this._updateState(adversaries.length == 1 ? adversaries[0] : null, adversaries);
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
				this._updateState(adversary, null, null, tags);
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
				this._updateState(adversary, null, null, tags);
			}
		});
	}

	toggleMenu() {
		let menuOpen = this.state.menuOpen;

		this._updateState(null, null, null, null, !menuOpen);
	}

	_updateState(adversary, list, filter, tags, menuOpen) {
		let selected = null;

		if(adversary) {
			selected = this.state.selected;
			selected[this.state.selectedIndex] = adversary;
		}

		if(menuOpen === undefined) {
			menuOpen = this.state.menuOpen;
		}

		this.setState({
			selected: selected || this.state.selected,
			list:     list     || this.state.list,
			filter:   filter   || this.state.filter,
			tags:     tags     || this.state.tags,
			menuOpen: menuOpen,
			isLoaded: this.loadedTotal == Object.keys(this.stores).length,
			selectedIndex: this.state.selectedIndex
		});

		if(this.state.selected.length > 0) {
			location.hash = this.state.selected[this.state.selectedIndex].id;
		}
	}

	componentWillUnmount() {
		Object.keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	render() {
		let x = this.state.list != null ? this.state.list.length : 0;
		let y = this.stores.adversaries != null ? this.stores.adversaries.all().length : 0;

		return <div>
			<div id="mobile-menu">
				<span className="btn" onClick={ this.toggleMenu.bind(this) }><svg><use href="#icon-menu"></use></svg></span>
				<em>Star Wars: Adversaries</em>
			</div>
			<TagMenu tags={ this.state.tags } />
			<div id="navigation" className={ (this.state.menuOpen ? "menu-open" : "menu-closed") + " column small" }>
				<Filter filter={ this.state.filter } />
				<p><small>Showing { x } of { y }.</small></p>
				<LinkList data={ this.state.list } selected={ this.state.selected.length > 0 ? this.state.selected[this.state.selectedIndex].id : "" } />
			</div>
			<div id="content" className="column large">
				{ !this.state.isLoaded
					? <Loader />
					: <div>
						{ this.state.selected.map((selected, index) => <Character key={ index } character={ selected } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } qualities={ this.stores.qualities } visible={ index == this.state.selectedIndex } />)}
						<Tabs tabs={ this.state.selected.map(c => c.name) } selectedIndex={ this.state.selectedIndex } />
					</div>
				}
			</div>
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
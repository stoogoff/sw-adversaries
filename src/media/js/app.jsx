
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Tab from "lib/tab";
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
			menuOpen: false,
			showAbout: false
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

			this.setState({
				list: adversaries,
				tags: tags
			});
			this.selectAdversary(adversary);
			this.setLoaded();
		});

		Object.keys(this.stores).forEach(key => {
			if(key != "adversaries") {
				this.events[key] = this.stores[key].on("change", () => this.setLoaded());
			}
		});

		// view object from menu
		dispatcher.register(CONFIG.OBJECT_VIEW, id => {
			this.setState({ menuOpen: false });
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
			let adversaries = this.stores.adversaries.all();

			if(filter != "") {
				filter = filter.toLowerCase();

				adversaries = adversaries.filter(a => a.name.toLowerCase().indexOf(filter) != -1 || a.tags.find(t => t.toLowerCase() == filter) != undefined);
			}

			this.setState({ list: adversaries });

			if(adversaries.length == 1) {
				this.selectAdversary(adversaries[0]);
			}
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
		let showAbout = !this.state.showAbout;

		this.setState({ showAbout: showAbout});
	}

	componentWillUnmount() {
		Object.keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	render() {
		let x = this.state.list != null ? this.state.list.length : 0;
		let y = this.stores.adversaries != null ? this.stores.adversaries.all().length : 0;
		let overlay = this.state.showAbout ?
			<div id="overlay">
				<div className="panel">
					<h3>About</h3>
					<p>Star Wars Adversaries is an easily searchable database of adversaries for <a href="https://www.fantasyflightgames.com/">Fantasy Flight Games’</a> Star Wars Roleplaying Game.</p>
					<p>Built by <a href="http://www.stoogoff.com/">Stoo Goff</a>, <a href="https://twitter.com/nlx3647">nlx3647</a>, and <a href="https://github.com/SkyJed">SkyJedi</a>.</p>
					<div className="btn pull-right" onClick={ this.toggleAbout.bind(this) }><svg><use href="#icon-cross"></use></svg> <span>Close</span></div>
				</div>
			</div>
			: null;

		return <div>
			{ overlay }
			<div id="mobile-menu">
				<span className="btn" onClick={ this.toggleMenu.bind(this) }><svg><use href="#icon-menu"></use></svg></span>
				<em>Star Wars: Adversaries</em>
			</div>
			<TagMenu tags={ this.state.tags } />
			<div id="navigation" className={ (this.state.menuOpen ? "menu-open" : "menu-closed") + " column small" }>
				<Filter />
				<p><small>Showing { x } of { y }.</small></p>
				<LinkList data={ this.state.list } selected={ this.state.selected.length > 0 ? this.state.selected[this.state.selectedIndex].id : "" } />
			</div>
			<div id="content" className="column large">
				{ !this.state.isLoaded
					? <Loader />
					: <div>
						{ this.state.selected.map((selected, index) => <Character key={ index } character={ selected.character } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } qualities={ this.stores.qualities } visible={ index == this.state.selectedIndex } />)}
						<Tabs tabs={ this.state.selected } selectedIndex={ this.state.selectedIndex } />
					</div>
				}
			</div>
			<div id="built-by"><span className="link" onClick={ this.toggleAbout.bind(this) }>About</span> | <a href="https://github.com/stoogoff/sw-adversaries">Source</a></div>
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);

import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Character from "components/character";
import LinkList from "components/link-list";
import Filter from "components/filter";
import Loader from "components/loader";
import { keys, sortByProperty } from "lib/utils";
import * as CONFIG from "lib/config";


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: null,
			list: null,
			filter: "",
			isLoaded: false
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

			this._updateState(adversaries.sort(sortByProperty("name"))[0], adversaries);
		});

		keys(this.stores).forEach(key => {
			if(key != "adversaries") {
				this.events[key] = this.stores[key].on("change", () => this._updateState());
			}
		});

		dispatcher.register(CONFIG.VIEW_OBJECT, id => {
			this._updateState(this.stores.adversaries.all().find(a => a.id == id));
		});

		dispatcher.register(CONFIG.FILTER_MENU, filter => {
			let adversaries = this.stores.adversaries.all();

			if(filter != "") {
				filter = filter.toLowerCase();

				adversaries = adversaries.filter(a => a.name.toLowerCase().indexOf(filter) != -1 || a.tags.indexOf(filter) != -1);
			}

			this._updateState(adversaries.length == 1 ? adversaries[0] : this.state.selected, adversaries);
		});
	}

	_updateState(selected, list, filter) {
		this.setState({
			selected: selected || this.state.selected,
			list:     list     || this.state.list,
			filter:   filter   || this.state.filter,
			isLoaded: this.loadedTotal == keys(this.stores).length
		});
	}

	componentWillUnmount() {
		keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	render() {
		let x = this.state.list != null ? this.state.list.length : 0;
		let y = this.stores.adversaries !=null ? this.stores.adversaries.all().length : 0;

		return <div>
			<div id="navigation" className="column small">
				<Filter filter={ this.state.filter } />
				<p><small>Showing { x } of { y }.</small></p>
				<LinkList data={ this.state.list } selected={ this.state.selected != null ? this.state.selected.id : "" } />
			</div>
			{ this.state.isLoaded
				? <Character character={ this.state.selected } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } qualities={ this.stores.qualities } />
				: <div id="content" className="column large">
					<Loader />
				</div>
			}
			<div className="built-by">Built by <a href="http://www.stoogoff.com/">Stoo Goff</a></div>
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
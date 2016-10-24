
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Character from "components/character";
import Vehicle from "components/vehicle";
import LinkList from "components/link-list";
import Filter from "components/filter";
import { keys } from "lib/utils";
import * as CONFIG from "lib/config";


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: null,
			list: null,
			filter: ""
		};
		this.events = {};
		this.stores = {};

		["skills", "adversaries", "weapons", "talents", "qualities", "vehicles", "vehicle-weapons"].forEach(key => {
			this.stores[key] = new DataStore(`media/data/${key}.json`);
			this.stores[key].load();
		});
	}

	componentDidMount() {
		this.events["adversaries"] = this.stores.adversaries.on("change", () => {
			this.setState({
				selected: this.stores.adversaries.get(0),
				list: this.stores.adversaries.all(),
				filter: this.state.filter
			});
		});
		this.events["vehicles"] = this.stores.vehicles.on("change", () => {
			this.stores.adversaries.concat(this.stores.vehicles.all());
		});

		keys(this.stores).forEach(key => {
			if(key != "adversaries" && key != "vehicles") {
				this.events[key] = this.stores[key].on("change", () => this.forceUpdate());
			}
		});

		dispatcher.register(CONFIG.VIEW_OBJECT, id => {
			this.setState({
				selected: this.stores.adversaries.all().find(a => a.id == id),
				list: this.state.list,
				filter: this.state.filter
			});
		});

		dispatcher.register(CONFIG.FILTER_MENU, filter => {
			let adversaries = this.stores.adversaries.all();

			if(filter != "") {
				filter = filter.toLowerCase();

				adversaries = adversaries.filter(a => a.name.toLowerCase().indexOf(filter) != -1 || a.tags.indexOf(filter) != -1);
			}

			this.setState({
				selected: adversaries.length == 1 ? adversaries[0] : this.state.selected,
				list: adversaries,
				filter: filter
			});
		});
	}

	componentWillUnmount() {
		keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	render() {
		let x = this.state.adversaries != null ? this.state.adversaries.length : 0;
		let y = this.stores.adversaries !=null ? this.stores.adversaries.all().length : 0;

		return <div>
			<div id="navigation" className="column small">
				<Filter filter={ this.state.filter } />
				<p><small>Showing { x } of { y }.</small></p>
				<LinkList data={ this.state.list } selected={ this.state.selected != null ? this.state.selected.id : "" } />
			</div>
			<Character character={ this.state.selected } skills={ this.stores.skills }  weapons={ this.stores.weapons } talents={ this.stores.talents } qualities={ this.stores.qualities } />
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
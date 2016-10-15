
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Character from "components/character";
import LinkList from "components/link-list";
import Filter from "components/filter";
import { keys } from "lib/utils";


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			adversary: null,
			adversaries: null
		};
		this.events = {};
		this.stores = {};

		["skills", "adversaries", "weapons", "talents"].forEach(key => {
			this.stores[key] = new DataStore(`media/data/${key}.json`);
			this.stores[key].load();
		});
	}

	componentDidMount() {
		this.events["adversaries"] = this.stores.adversaries.on("change", () => {
			this.setState({
				adversary: this.stores.adversaries.get(0),
				adversaries: this.stores.adversaries.all()
			});
		});

		keys(this.stores).forEach(key => {
			if(key != "adversaries") {
				this.events[key] = this.stores[key].on("change", () => this.forceUpdate())
			}
		});

		dispatcher.register("view-adversary", id => {
			this.setState({
				adversary: this.stores.adversaries.all().find(a => a.id == id),
				adversaries: this.state.adversaries
			});
		});

		dispatcher.register("filter-menu", filter => {
			let adversaries = this.stores.adversaries.all();

			if(filter != "") {
				filter = filter.toLowerCase();

				adversaries = adversaries.filter(a => a.name.toLowerCase().indexOf(filter) != -1);
			}

			this.setState({
				adversary: this.state.adversary,
				adversaries: adversaries
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
			<div className="column small">
				<Filter />
				<p><small>Showing { x } of { y }.</small></p>
				<LinkList data={ this.state.adversaries } />
			</div>
			<div className="column large">
				<Character skills={ this.stores.skills } character={ this.state.adversary } weapons={ this.stores.weapons } talents={ this.stores.talents } />
			</div>
		</div>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("container")
);
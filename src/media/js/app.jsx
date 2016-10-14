
import React from "react";
import ReactDOM from "react-dom";
import DataStore from "lib/data-store";
import dispatcher from "lib/dispatcher";
import Character from "components/character";
import { keys } from "lib/utils";



/*class Message extends React.Component {
	constructor(props) {
		super(props);

		this.state = { skills: props.skills };
	}

	componentDidMount() {
		this.state.skills.on("change", () => {
			this.forceUpdate();
		});
	}

	render() {
		return <ul> { this.state.skills.get().map(s => {
			return <li key={ s.name }>{ s.name } ({ s.characteristic })</li>;
		}) }
		</ul>;
	}
}*/


class LinkList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			list: props.data
		}
	}

	handler(evt) {
		var id = evt.target.getAttribute("data-target");

		dispatcher.dispatch("view-character", id);
	}

	render() {
		return <ul>
			{ this.state.list.map(l => <li key={ l.id }><span className="link" onClick={ this.handler } data-target={ l.id }>{ l.name }</span></li>) }
		</ul>;
	}
}



class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			character: null
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
				character: this.stores.adversaries.get(0)
			});

			this.forceUpdate();
		});

		keys(this.stores).forEach(key => {
			if(key != "adversaries") {
				this.events[key] = this.stores[key].on("change", () => this.forceUpdate())
			}
		});

		dispatcher.register("view-character", (id) => {
			this.setState({
				character: this.stores.adversaries.get().find(a => a.id == id)
			});
		});
	}

	componentWillUnmount() {
		keys(this.stores).forEach(key => this.stores[key].off(this.events[key]));
	}

	render() {
		return <div>
			<div className="column small"><LinkList data={ this.stores.adversaries.get() } /></div>
			<div className="column large"><Character skills={ this.stores.skills } character={ this.state.character } weapons={ this.stores.weapons } talents={ this.stores.talents } /></div>
		</div>;
	}
}




ReactDOM.render(
	<App />,
	document.getElementById("container")
);
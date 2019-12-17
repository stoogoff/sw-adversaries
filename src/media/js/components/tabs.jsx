
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";
import { parent } from "lib/utils";

export default class Tabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: -1
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.selectedIndex !== this.props.selectedIndex) {
			this.closeMenu();
		}
	}

	add() {
		dispatcher.dispatch(CONFIG.TAB_ADD);
	}

	remove(evt) {
		this.closeMenu();

		dispatcher.dispatch(CONFIG.TAB_REMOVE, this._getIndex(parent(evt.target, "li")));
	}

	rename(evt) {
		dispatcher.dispatch(CONFIG.TAB_RENAME, this._getIndex(parent(evt.target, "li")), evt.target.value);
	}

	changeColour(evt) {
		this.closeMenu();

		dispatcher.dispatch(CONFIG.TAB_COLOUR, this._getIndex(parent(evt.target, "li")), evt.target.getAttribute("data-colour"));
	}

	closeMenu() {
		this.setState({
			active: -1
		});
	}

	toggleMenu(evt) {
		let index = this._getIndex(evt.target);

		this.setState({
			active: index === this.state.active ? -1 : index
		});
	}

	view(evt) {
		dispatcher.dispatch(CONFIG.TAB_CHANGE, this._getIndex(evt.target));
	}

	_getIndex(target) {
		let node = parent(target, "li");

		if(node) {
			return parseInt(node.getAttribute("data-index"), 10);
		}

		return -1;
	}

	render() {
		let tabs = this.props.tabs;
		let colours = CONFIG.COLOURS.map(c => {
			return <li key={ c }><div className={ "colour tab-" + c } data-colour={ c } onClick={ this.changeColour.bind(this) } >&nbsp;</div></li>;
		});

		return <ul id="tabs">
			{ tabs.map((t, i) => <li key={ i } className={ i == this.props.selectedIndex ? "active " : null } data-index={ i }>
				<span className="btn" onClick={ this.view.bind(this) }>
					{ t.colour ? <span className={ "square tab-" + t.colour }></span> : null }
					{ t.tabName }
				</span>
				<small className="btn tools" onClick={ this.toggleMenu.bind(this) }><svg><use xlinkHref="#icon-cog"></use></svg></small>

				<ul className={ this.state.active ==  i ? "active" : "" }>
					<li><input type="text" value={ t.tabName } onChange={ this.rename.bind(this) } /></li>
					{ colours }
					<li onClick={ this.remove.bind(this) }><div className="btn"><svg><use xlinkHref="#icon-delete"></use></svg> Remove</div></li>
				</ul>
			</li>) }
			<li className="tools"><small className="btn" onClick={ this.add.bind(this) }><svg><use xlinkHref="#icon-plus"></use></svg> Add</small></li>
		</ul>;
	}
}
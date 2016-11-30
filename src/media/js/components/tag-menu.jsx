
import React from "react";

export default class TagMenu extends React.Component {
	openMenu(evt) {
		console.log(evt.target)
		evt.target.parentNode.className = "active";
	}

	render() {
		console.log("TagMenu.render")
		console.log(this.props.tags)

		return <ul id="menu">
			<li><div onClick={ this.openMenu.bind(this) }>Books <small className="fa fa-angle-down"></small></div>
				<ul>
					<li>underworld</li>
					<li>species:Droid</li>
					<li>assassin</li>
					<li>book:lonh</li>
					<li>adventure:Rubbing Slimy Elbows</li>
					<li>book:fad</li>
					<li>adventure:Lessons from the Past</li>
					<li>civilian</li>
					<li>scholar</li>
					<li>book:ragp</li>
					<li>adventure:Rescue at Glare Peak</li>
					<li>book:eote</li>
				</ul>
			</li>
			<li><div onClick={ this.openMenu.bind(this) }>Adventures <small className="fa fa-angle-down"></small></div>
				<ul>
					<li>underworld</li>
					<li>species:Droid</li>
					<li>assassin</li>
					<li>book:lonh</li>
					<li>adventure:Rubbing Slimy Elbows</li>
					<li>book:fad</li>
					<li>adventure:Lessons from the Past</li>
					<li>civilian</li>
					<li>scholar</li>
					<li>book:ragp</li>
					<li>adventure:Rescue at Glare Peak</li>
					<li>book:eote</li>
				</ul>
			</li>
			<li><div onClick={ this.openMenu.bind(this) }>Species <small className="fa fa-angle-down"></small></div>
				<ul>
					<li>underworld</li>
					<li>species:Droid</li>
					<li>assassin</li>
					<li>book:lonh</li>
					<li>adventure:Rubbing Slimy Elbows</li>
					<li>book:fad</li>
					<li>adventure:Lessons from the Past</li>
					<li>civilian</li>
					<li>scholar</li>
					<li>book:ragp</li>
					<li>adventure:Rescue at Glare Peak</li>
					<li>book:eote</li>
				</ul>
			</li>
			<li><div onClick={ this.openMenu.bind(this) }>Tags <small className="fa fa-angle-down"></small></div>
				<ul>
					<li>underworld</li>
					<li>species:Droid</li>
					<li>assassin</li>
					<li>book:lonh</li>
					<li>adventure:Rubbing Slimy Elbows</li>
					<li>book:fad</li>
					<li>adventure:Lessons from the Past</li>
					<li>civilian</li>
					<li>scholar</li>
					<li>book:ragp</li>
					<li>adventure:Rescue at Glare Peak</li>
					<li>book:eote</li>
				</ul>
			</li>
		</ul>;
	}
}
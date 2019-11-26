
import React from "react";
import { symbolise } from "lib/utils";

export default class PanelInfo extends React.Component {
	render() {
		return <div className="info">
			<h2>{ this.props.title }</h2>
			{ this.props.data && this.props.data.length > 0 ? 
				<ul className="inline-list">
					{ this.props.data.map((d, i) => <li key={ i }><span dangerouslySetInnerHTML= { symbolise(d) } /></li>) }
				</ul>
				: <p>–</p>
			}
		</div>;
	}
}
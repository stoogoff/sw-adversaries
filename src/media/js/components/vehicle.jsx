
import React from "react";
import TextPanel from "./text-panel";


export default class Vehicle extends React.Component {
	render() {
		let vehicle = this.props.vehicle;

		if(!vehicle) {
			return null;
		}

		let characteristics = [];

		for(let i in vehicle.characteristics) {
			characteristics.push({
				"name": i,
				"value": vehicle.characteristics[i]
			});
		}

		return <div id="character" className="column large">
			<h1><span>{ vehicle.name }</span><small className={ vehicle.type.toLowerCase() }>{ vehicle.type }</small></h1>
			<TextPanel text={ vehicle.description } />
			{ vehicle.notes ? <div className="text"><p><em>{ vehicle.notes }</em></p></div> : null }
			<div className="column small">
				<div className="stats" id="characteristics">
					{ characteristics.map(c => {
						return <div key={ c.name }><span>{ c.value }</span><h3>{ c.name }</h3></div>
					})}
				</div>
			</div>
			<div className="column large"></div>
		</div>;
	}
}
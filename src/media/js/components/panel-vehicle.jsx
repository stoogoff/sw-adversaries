
import React from "react";
import { hashToArray } from "../lib/utils";

export default class PanelVehicle extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
	}

	open() {
		this.setState({
			open: true
		});
	}

	close() {
		this.setState({
			open: false
		});
	}

	clickHandler() {
		if(this.props.onClose) {
			this.props.onClose();
		}
	}

	render() {
		if(this.props.vehicle == null) {
			return null;
		}

		let vehicle = this.props.vehicle;
		let characteristics = hashToArray(vehicle.characteristics);

		let hyperdrive = vehicle.info.hyperdrive && vehicle.info.hyperdrive.primary
			? <div>
				<span>Primary: Class { vehicle.info.hyperdrive.primary }, </span>
				<span>Backup: { vehicle.info.hyperdrive.backup ? `Class ${vehicle.info.hyperdrive.backup}` : "None" }</span>
			</div>
			: (vehicle.info.hyperdrive ? `Class ${vehicle.info.hyperdrive}, Backup: None` : "None");

		return <div className="info">
			<h2>{ vehicle.name }</h2>
			<h4>{ vehicle.fullName }</h4>
			<span id="vehicle-close" className="btn" title="Remove vehicle" onClick={ this.clickHandler.bind(this) }><svg><use xlinkHref="#icon-cross"></use></svg> Remove Vehicle</span>
			<div className="stats" id="vehicle">
				{ characteristics.map(c => {
					return <div key={ c.name }><span>{ c.value }</span><h3>{ c.name }</h3></div>
				})}
			</div>
			<div>
				{ this.state.open
					? <h4 className="expander" onClick={ this.close.bind(this) }><svg><use xlinkHref="#icon-circle-down"></use></svg>Information</h4>
					: <h4 className="expander" onClick={ this.open.bind(this) }><svg><use xlinkHref="#icon-circle-right"></use></svg>More Information</h4>
				}
				{ this.state.open ? <table className="weapons">
					<tbody>
						<tr>
							<th>Hull Type/Class:</th>
							<td>{ vehicle.info.type }</td>
						</tr>
						<tr>
							<th>Manufacturer:</th>
							<td>{ vehicle.info.manufacturer }</td>
						</tr>
						<tr>
							<th>Hyperdrive:</th>
							<td>{ hyperdrive }</td>
						</tr>
						<tr>
							<th>Navicomputer:</th>
							<td>{ vehicle.info.navicomputer ? vehicle.info.navicomputer : "None" }</td>
						</tr>
						<tr>
							<th>Sensor Range:</th>
							<td>{ vehicle.info.sensors }</td>
						</tr>
						<tr>
							<th>Ship's Complement:</th>
							<td>{ vehicle.info.complement }</td>
						</tr>
						<tr>
							<th>Encumbrance Capacity:</th>
							<td>{ vehicle.info.encumbrance }</td>
						</tr>
						<tr>
							<th>Passenger Capacity:</th>
							<td>{ vehicle.info.passengers }</td>
						</tr>
						<tr>
							<th>Consumables:</th>
							<td>{ vehicle.info.consumables }</td>
						</tr>
						<tr>
							<th>Price/Rarity:</th>
							<td>{ vehicle.info.price } credits { vehicle.info.restricted ? "(R)" : null } / { vehicle.info.rarity }</td>
						</tr>
						<tr>
							<th>Customization Hard Points:</th>
							<td>{ vehicle.info.hardpoints }</td>
						</tr>
					</tbody>
				</table>
				: null }
			</div>
		</div>;
	}
}

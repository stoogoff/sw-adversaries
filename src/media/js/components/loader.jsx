
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class Loader extends React.Component {
	render() {
		return <div className="loading"><span className="fa fa-spin fa-spinner"></span> Loading...</div>;
	}
}
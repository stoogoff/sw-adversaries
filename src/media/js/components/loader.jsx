
import React from "react";
import dispatcher from "lib/dispatcher";
import * as CONFIG from "lib/config";

export default class Loader extends React.Component {
	render() {
		return <div className="loading"><svg className="spinner"><use xlinkHref="#icon-spinner9"></use></svg> Loading...</div>;
	}
}
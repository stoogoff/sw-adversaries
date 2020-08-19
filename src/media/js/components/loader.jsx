
import React from "react";

export default class Loader extends React.Component {
	render() {
		return <div className="loading"><svg className="spinner"><use xlinkHref="#icon-spinner9"></use></svg> Loading...</div>;
	}
}
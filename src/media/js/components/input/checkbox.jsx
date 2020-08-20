
import React from "react";
import { id } from "../../lib/string";

// props:
// handler (function) - callback function when the checkbox is clicked, this passes the object (if set) or label to the handler
// label (string) - the text label to display
// checked (boolean) - whether the checkbox is checked or not
// object (object, optional) - an object which is bound to this checkbox
export default props => {
	const handleChange = (evt) => {
		if(props.handler) {
			props.handler(props.object || props.label);
		}
	};

	let checkbox = props.checked
		? <svg><use xlinkHref="#icon-checkbox-checked"></use></svg>
		: <svg><use xlinkHref="#icon-checkbox-unchecked"></use></svg>
	;
	let className = "row-input input-checkbox" + (props.checked ? " checked" : "");

	return <div className={ className } onClick={ handleChange }>
		<label>{ props.label }</label>
		{ checkbox }
	</div>;
};


import React from "react";


const checked = <svg><use xlinkHref="#icon-checkbox-checked"></use></svg>;
const unchecked = <svg><use xlinkHref="#icon-checkbox-unchecked"></use></svg>;


// props:
// handler (function) - callback function when the checkbox is clicked, this passes the index to the handler
// labels (array of string) - the text labels to display
// checkedIndex (number) - the label to check
export default props => {
	const handleChange = (index) => {
		console.log(`Clicked index: ${index}`)

		if(props.handler) {
			props.handler(index);
		}
	};

	return <div>
		{ props.labels.map((l, idx) => <label onClick={ handleChange.bind(null, idx) }>
			{ props.checkedIndex === idx ? checked : unchecked }
			{ l }
		</label>) }
	</div>;
};

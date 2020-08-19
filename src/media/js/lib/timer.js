
export const throttle = (callback) => {
	let t = null;

	return (value) => {
		if(t != null) {
			window.clearTimeout(t);
		}

		t = window.setTimeout(() => {
			callback(value);
		}, 250);
	}
};

export const after = (times, callback) => {
	return (...args) => {
		if(--times == 0) {
			callback(...args);
		}
	};
};

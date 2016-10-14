

// subscribe / publish handler
export default class Emitter {
	constructor() {
		this.ref = 0;
		this.events = {};
	}

	// emit calls any functions which are mapped to the supplied string. All parameters after the first are passed to each
	// function that is called.
	emit(event, ...args) {
		if(!this.events[event]) {
			return false;
		}

		var evt = this.events[event];

		for(var i in evt) {
			evt[i](...args);
		}

		return true;
	}

	// Link the supplied callback function to supplied event string.
	on(event, callback) {
		if(!this.events[event]) {
			this.events[event] = {};
		}

		let ref = "evt_" + (++this.ref);

		this.events[event][ref] = callback;

		return ref;
	}

	// Delete the referenced function from the event.
	off(event, reference) {
		if(!this.events[event]) {
			return false;
		}

		delete this.events[event][reference];

		return true;
	}
};

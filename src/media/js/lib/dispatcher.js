
import Emitter from "./emitter";

// dispatcher is really just a global event emitter
let emitter = new Emitter();

let dispatcher = {
	register(action, method) {
		return emitter.on(action, method);
	},

	unregister(action, reference) {
		return emitter.off(action, reference);
	},

	dispatch(action, ...data) {
		return emitter.emit(action, ...data);
	},
};

export default dispatcher;

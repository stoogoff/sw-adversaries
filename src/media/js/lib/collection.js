
import Emitter from "./emitter";

export default class Collection extends Emitter {
	constructor(...args) {
		super(...args);

		this.data = [];
	}

	remove(index) {
		if(index < 0 || index >= this.data.length) {
			throw "Index out of range";
		}

		this.data.splice(index, 1);

		this.emit("change");

		return this;
	}

	push(row) {
		var result = this.data.push(row);

		this.emit("change");

		return result;
	}

	pop() {
		var row = this.data.pop();

		this.emit("change");

		return row;
	}

	unshift(row) {
		var result = this.data.unshift(row);

		this.emit("change");

		return result;
	}

	shift() {
		var row = this.data.shift();

		this.emit("change");

		return row;
	}

	clear() {
		this.data = [];

		this.emit("change");

		return this;
	}

	concat(range) {
		this.data = this.data.concat(range);

		this.emit("change");

		return this;
	}

	all() {
		return this.data;
	}

	get(index) {
		return index >= 0 && index < this.data.length ? this.data[index] : null;
	}
}
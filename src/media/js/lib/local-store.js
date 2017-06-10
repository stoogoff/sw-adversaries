
export class Storage {
	constructor(storage) {
		this.storage = storage;
	}

	set(key, value) {
		this.storage.setItem(key, JSON.stringify(value));
	}

	get(key) {
		return JSON.parse(this.storage.getItem(key));
	}

	has(key) {
		return this.storage.getItem(key) != null;
	}

	keys() {
		let keys = [];

		for(let i = 0; i < this.storage.length; ++i) {
			keys.push(this.storage.key(i));
		}

		return keys;
	}

	remove(...keys) {
		keys.forEach(key => this.storage.removeItem(key));
	}

	clear() {
		this.storage.clear();
	}
}

export const local = new Storage(window.localStorage);
export const session = new Storage(window.sessionStorage);

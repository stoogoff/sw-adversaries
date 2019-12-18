
import ajax from "./nanoajax";
import Collection from "./collection";
import { id } from "./string";

export default class DataStore extends Collection {
	constructor(url, ...args) {
		super(...args);

		this.url = url;
	}

	load(callback) {
		ajax({ url: this.url }, (code, response, xhr) => {
			let data = JSON.parse(response);

			// force everything to have an id
			data.forEach(d => {
				if(!d.id) {
					d.id = id(d.name);
				}
			});

			if(callback) {
				callback(data);
			}

			this.concat(data);
		});
	}
}

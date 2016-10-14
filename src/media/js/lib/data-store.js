
import ajax from "./nanoajax";
import Collection from "./collection";
import * as utils from "./utils";

export default class DataStore extends Collection {
	constructor(url, ...args) {
		super(...args);

		this.url = url;
	}

	load() {
		ajax({ url: this.url }, (code, response, xhr) => {
			let data = JSON.parse(response);

			// force everything to have an id
			data.forEach(d => {
				if(!d.id) {
					d.id = utils.id(d.name);
				}
			});

			this.pushRange(data);
		});
	}
}


export let id = function id(input) {
	return input.trim().replace(/\s{1,}/g, "-").toLowerCase();
}

export let keys = function keys(obj) {
	let arr = [];

	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			arr.push(i);
		}
	}

	return arr;
}

export let dice = function dice(stat, skill) {
	let total = Math.max(stat, skill);
	let upgrade = Math.min(stat, skill);
	let images = [];

	for(let j = 0; j < upgrade; ++j) {
		images.push("icon ability");
	}

	for(let j = upgrade; j < total; ++j) {
		images.push("icon proficiency");
	}

	return images;
}
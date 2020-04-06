
export const sortByProperty = function sortByProperty(prop) {
	return function sort(a, b) {
		a = a[prop];
		b = b[prop];

		return a == b ? 0 : (a < b ? -1: 1);
	};
};

export const sortByProperties = function sortByProperties(prop1, prop2) {
	const sort1 = sortByProperty(prop1);
	const sort2 = sortByProperty(prop2);

	return function sort(a, b) {
		return sort1(a, b) || sort2(a, b);
	}
}

export const findByProperty = function findByProperty(property, value) {
	return function(item) {
		return property in item && item[property] == value;
	};
}

export const indexOfByProperty = function indexOfByProperty(list, property, value) {
	for(let i = 0; i < list.length; ++i) {
		let item = list[i];

		if(property in item && item[property] == value) {
			return i;
		}
	}

	return -1;
}

export const unique = function unique(arr) {
	return arr.filter((a, i) => arr.indexOf(a) == i);
}

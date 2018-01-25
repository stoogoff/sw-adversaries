
export const id = function id(input) {
	return input.trim().replace(/[^a-z0-9\s]/gi, '').replace(/\s{1,}/g, "-").toLowerCase();
}

export const parent = function parent(node, parent) {
	parent = parent.toLowerCase();

	while((node = node.parentNode) != null) {
		if(node.nodeName.toLowerCase() === parent) {
			return node;
		}
	}

	return null;
}

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

export const minionSkill = function(minions, skill, skills) {
	let value = 0;
	let skillsHash = {};

	if(Array.isArray(skills)) {
		skills.forEach(s => skillsHash[s] = 0);
	}
	else {
		skillsHash = skills;
	}

	if(minions > 0 && skill in skillsHash) {
		value += minions - 1;
	}
	return  Math.min(value, 5);
}

export const dice = function dice(stat, skill) {
	let total = Math.max(stat, skill);
	let upgrade = Math.min(stat, skill);
	let symbols = [];

	for(let j = 0; j < upgrade; ++j) {
		symbols.push(diceMap["proficiency"]);
	}

	for(let j = upgrade; j < total; ++j) {
		symbols.push(diceMap["ability"]);
	}

	return { __html: symbols.join("") };
}

export const symbolise = function symbolise(text) {
	Object.keys(diceMap).forEach(k => {
		let reg = new RegExp(`:${k}:`, "g");

		text = text.replace(reg, diceMap[k]);
	});

	return { __html: text };
}

let diceMap = {
	// dice
	"boost": "<span class='icon boost shadowed'>b</span>",
	"proficiency": "<span class='icon proficiency shadowed'>c</span>",
	"ability": "<span class='icon ability shadowed'>d</span>",
	"setback": "<span class='icon setback shadowed'>b</span>",
	"challenge": "<span class='icon challenge shadowed'>c</span>",
	"difficulty": "<span class='icon difficulty shadowed'>d</span>",
	"force": "<span class='icon force shadowed'>c</span>",

	// outcomes
	"advantage": "<span class='icon advantage'>a</span>",
	"failure": "<span class='icon failure'>f</span>",
	"success": "<span class='icon success'>s</span>",
	"threat": "<span class='icon threat'>t</span>",
	"triumph": "<span class='icon triumph'>x</span>",
	"despair": "<span class='icon despair'>y</span>",

	// force
	"lightside": "<span class='icon lightside shadowed'>z</span>",
	"darkside": "<span class='icon darkside'>z</span>",

	// difficulty levels
	"easy": "<strong>Easy</strong> (<span class='icon difficulty shadowed'>d</span>)",
	"average": "<strong>Average</strong> (<span class='icon difficulty shadowed'>dd</span>)",
	"hard": "<strong>Hard</strong> (<span class='icon difficulty shadowed'>ddd</span>)",
	"daunting": "<strong>Daunting</strong> (<span class='icon difficulty shadowed'>dddd</span>)",
	"formidable": "<strong>Formidable</strong> (<span class='icon difficulty shadowed'>ddddd</span>)",
};

export const book = function book(name) {
	return name in bookMap ? bookMap[name] : name;
}

let bookMap = {
	// core books
	"book:aor": "Age of Rebellion",
	"book:eote": "Edge of the Empire",
	"book:fad": "Force and Destiny",

	// beginner games
	"book:aorbg": "Age of Rebellion: Beginner’s Game",
	"book:eotebg": "Edge of the Empire: Beginner’s Game",

	// source books
	"book:lonh": "Lords of Nal Hutta",
	"book:sor": "Strongholds of Resistance",
	"book:sof": "Suns of Fortune",
	"book:nop": "Nexus of Power",

	// career books
	"book:dc": "Dangerous Covenants", // no stats
	"book:da": "Desparate Allies",
	"book:doh": "Disciples of Harmony",
	"book:ev": "Endless Vigil",
	"book:fh": "Far Horizons",
	"book:fc": "Fly Casual",          // no stats
	"book:ktp": "Keeping the Peace",
	"book:lbe": "Lead by Example",
	"book:sm": "Special Modifications",
	"book:sot": "Stay on Target",
	"book:ss": "Savage Spirits",

	// adventures
	"book:oaa": "Onslaught at Arda I",
	"book:cotgk": "Chronicles of the Gatekeeper",
	"book:ragp": "Rescue at Glare Peak",
	"book:uabs": "Under a Black Sun",
	"book:flt": "Friends Like These",
	"book:btr": "Beyond the Rim",
	"book:motpq": "Mask of the Pirate Queen",
	"book:joy": "Jewel of Yavin",
	"book:god": "Ghosts of Dathomir"
};

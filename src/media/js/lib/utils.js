
export const id = function id(input) {
	return input.trim().normalize("NFD").replace(/[^a-z0-9\-\s]/gi, '').replace(/\s{1,}/g, "-").toLowerCase();
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


// convert marked text into dice and return in a React dangerouslySetInnerHTML format
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


// convert marked text into game symbols and return in a React dangerouslySetInnerHTML format
export const symbolise = function symbolise(text) {
	Object.keys(diceMap).forEach(k => {
		let reg = new RegExp(`:${k}:`, "g");

		text = text.replace(reg, diceMap[k]);
	});

	return { __html: text };
}

let diceMap = {
	// dice
	"boost": "<span class='icon boost'></span>",
	"proficiency": "<span class='icon proficiency'></span>",
	"ability": "<span class='icon ability'></span>",
	"setback": "<span class='icon setback'></span>",
	"challenge": "<span class='icon challenge'></span>",
	"difficulty": "<span class='icon difficulty'></span>",
	"force": "<span class='icon force'></span>",

	// outcomes
	"advantage": "<span class='icon advantage'></span>",
	"failure": "<span class='icon failure'></span>",
	"success": "<span class='icon success'></span>",
	"threat": "<span class='icon threat'></span>",
	"triumph": "<span class='icon triumph'></span>",
	"despair": "<span class='icon despair'></span>",

	// force
	"lightside": "<span class='icon lightside'></span>",
	"darkside": "<span class='icon darkside'></span>",
	"forcepip": "<span class='icon forcepip'></span>",

	// difficulty levels
	"easy": "<strong>Easy</strong> (<span class='icon difficulty'></span>)",
	"average": "<strong>Average</strong> (<span class='icon difficulty'></span><span class='icon difficulty'></span>)",
	"hard": "<strong>Hard</strong> (<span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span>)",
	"daunting": "<strong>Daunting</strong> (<span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span>)",
	"formidable": "<strong>Formidable</strong> (<span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span>)",

	// upgraded easy difficulty
	"easy-1": "<strong>Easy</strong> (<span class='icon challenge'></span>)",

	// upgraded average difficulty
	"average-1": "<strong>Average</strong> (<span class='icon challenge'></span><span class='icon difficulty'></span>)",
	"average-2": "<strong>Average</strong> (<span class='icon challenge'></span><span class='icon challenge'></span>)",

	// upgraded hard difficulties
	"hard-1": "<strong>Hard</strong> (<span class='icon challenge'></span><span class='icon difficulty'></span><span class='icon difficulty'></span>)",
	"hard-2": "<strong>Hard</strong> (<span class='icon challenge'></span><span class='icon challenge'></span><span class='icon difficulty'></span>)",
	"hard-3": "<strong>Hard</strong> (<span class='icon challenge'></span><span class='icon challenge'></span><span class='icon challenge'></span>)",

	// upgraded daunting difficulties
	"daunting-1": "<strong>Daunting</strong> (<span class='icon challenge'></span><span class='icon difficulty'></span><span class='icon difficulty'></span><span class='icon difficulty'></span>)",
};


// return book name
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
	"book:tfabg": "The Force Awakens: Beginner’s Game",

	// source books
	"book:lonh": "Lords of Nal Hutta",
	"book:sor": "Strongholds of Resistance",
	"book:sof": "Suns of Fortune",
	"book:nop": "Nexus of Power",
	"book:dor": "Dawn of Rebellion",
	"book:rots": "Rise of the Separatists",
	"book:aaa": "Allies and Adversaries",

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
	"book:eto": "Enter the Unknown",
	"book:kof": "Knights of Fate",
	"book:fo": "Fully Operational",
	"book:cam": "Cyphers and Masks",

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


// add talent ranks, and correct numbers of dice to talent text
export const statify = function(text, stats, ranks) {
	// convert characteristics and skills
	Object.keys(stats).forEach(k => text = text.replace(new RegExp(`\{${k}\}`, "g"), stats[k]));

	// insert ranks and format
	text = text.replace(/\{ranks\}/g, ranks);
	text = text.replace(/\{ranks\|words\}/g,       () => words[ranks]);
	text = text.replace(/\{ranks\|times\}/g,       () => times[ranks]);
	text = text.replace(/\{ranks\|multiply-10\}/g, () => ranks * 10);
	text = text.replace(/\{ranks\|multiply-50\}/g, () => ranks * 50);
	text = text.replace(/\{ranks\|plus-2\}/g,      () => ranks + 2);

	// add game symbols a number of times equal to ranks
	["setback", "boost", "success", "threat", "force"].forEach(symbol => text = text.replace(new RegExp(`\{ranks\\|(${symbol})\}`, "g"), (s, match) => r(match, ranks)));

	return text;
}

let words = ["", "one", "two", "three", "four", "five"];
let times = ["", "once", "twice", "three times", "four times", "five times"];


function r(symbol, ranks) {
	let buffer = [];

	for(let i = 0; i < ranks; ++i) {
		buffer.push(`:${symbol}:`);
	}

	return buffer.join("");
}


let sourceMap = {
	"source:Never Tell Me the Odds": "http://www.starwarsrpgpodcast.com/",
	"source:D20Radio.com": "http://www.d20radio.com/main/"
};

export const getSourceLink = function(source) {
	if(source in sourceMap) {
		return `<a href="${sourceMap[source]}">${source.replace("source:", "")}</a>`;
	}

	return null;
}
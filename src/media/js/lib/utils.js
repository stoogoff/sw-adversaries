
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

export let sortByProperty = function sortByProperty(prop) {
	return function sort(a, b) {
		a = a[prop];
		b = b[prop];

		return a == b ? 0 : (a < b ? -1: 1);
	};
};

export let minionSkill = function(minions, skill, skills) {
	let value = 0;

	if(minions > 0 && skill in skills) {
		value += minions - 1;
	}

	return  Math.min(value, 5);
}

export let dice = function dice(stat, skill) {
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

export let symbolise = function symbolise(text) {
	keys(diceMap).forEach(k => {
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

export let book = function book(name) {
	return name in bookMap ? bookMap[name] : name;
}

let bookMap = {
	// core books
	"book:aor": "Age of Rebellion",
	"book:eote": "Edge of the Empire",
	"book:fad": "Force and Destiny",

	// source books
	"book:lonh": "Lords of Nal Hutta",
	"book:sor": "Strongholds of Resistance",
	"book:nop": "Nexus of Power",

	// career books
	"book:da": "Desparate Allies",
	"book:fh": "Far Horizons",
	"book:ktp": "Keeping the Peace",
	"book:sm": "Special Modifications",
	"book:sot": "Stay on Target",

	// adventures
	"book:cotgk": "Chronicles of the Gate Keeper",
	"book:ragp": "Rescue at Glare Peak",
	"book:uabs": "Under a Black Sun"
};
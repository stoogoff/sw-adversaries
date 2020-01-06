
"use strict";

const fs = require("fs"); 
const path = require("path"); 


// warn if multiple talents with the same key are found
const addToHash = (talent, key) => {
	if(talent[key] in talents) {
		console.warn(`DUPLICATE TALENT: ${talent[key]}`);
		return;
	}

	talents[talent[key]] = talent;
};

// check all linked items in the adversary's sub-object exist in the supplied array
const checkForMissing = (adv, key, arr) => {
	let missing = [];

	if(key in adv) {
		adv[key].forEach(t => {
			// only check linked talents, not inline ones
			if(typeof t == "string" && !(t.replace(/\s\d+$/, "") in arr)) {
				missing.push(`${key}: ${t}`);
			}
		});
	}

	return missing;
};


const BASE_PATH = "../src/media/data";
const ADV_PATH = path.join(BASE_PATH, "adversaries");


// load all talents and remove those with empty descriptions, as they're removed from final output
let talents = {};

[
	...require(path.join(BASE_PATH, "talents/abilities.json")),
	...require(path.join(BASE_PATH, "talents/force-powers.json")),
	...require(path.join(BASE_PATH, "talents/talents.json"))
].filter(t => t.description != "").forEach(f => addToHash(f, "id" in f ? "id" : "name"));


// load all weapons
const weapons = {};

require(path.join(BASE_PATH, "weapons.json")).forEach(w => weapons[w.name] = w);


// load and merge all adversaries
const FILES = fs.readdirSync(ADV_PATH);

let adversaries = [], errors = 0;

FILES.forEach(f => adversaries = adversaries.concat(require(path.join(ADV_PATH, f))));

adversaries.forEach(a => {
	let missing = [
		...checkForMissing(a, "talents", talents),
		...checkForMissing(a, "abilities", talents),
		...checkForMissing(a, "weapons", weapons)
	];

	if(missing.length > 0) {
		console.log(`MISSING from: ${a.name}:`);
		console.log("\t" + missing.join("\n\t"));

		errors++;
	}
});

console.log(`Found ${errors} errors.`);
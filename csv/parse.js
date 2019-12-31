
"use strict";

const fs = require("fs"); 
const path = require("path"); 
const csv = require("csv-parser");
const ABILITIES = require("./data/abilities.json");
const FORCE_POWERS = require("./data/force-powers.json");
const WEAPONS = require("./data/weapons.json");
const CUSTOM_WEAPONS = require("./data/custom-weapons.json");


const after = (f, t) => {
	return () => {
		if(--t == 0) {
			f();
		}
	}
};


const outputKeys = [
	"characteristics",
	"derived",
	"skills",
	"talents",
	"abilities",
	"gear",
	"tags"
];
const keyMap = {
	"Soak": "soak",
	"Wound Threshold": "wounds",
	"Strain Threshold": "strain"
};
const tagMap = {
	"bonus.csv": [],
	"darkside.csv": ["darkside", "force sensitive"],
	"jedi.csv": ["jedi", "force sensitive"],
	"people.csv": [],
	"republic.csv": ["republic"],
	"scum.csv": ["underworld"],
	"separatists.csv": ["separatist"]
};

// convert custom weapons, abilities and force powers to name/id as key
let abilities = {}, customWeapons = {};

ABILITIES.forEach(a => abilities[a.name] = a);
FORCE_POWERS.map(m => {
	delete m.character;

	return m;
}).forEach(a => abilities[a.id.toLowerCase()] = a);
CUSTOM_WEAPONS.forEach(a => customWeapons[a.name] = a);


// get all of the CSV files ready to process
const FILES = fs.readdirSync("input");
//const FILES = ["bonus.csv"];

// output to
let finalOutput = [];

let complete = after(() => {
	console.log(JSON.stringify(finalOutput, null, 1).trim());
}, FILES.length);



// process all files
FILES.forEach(input => {
	let output = {};
	let chunk = null;
	let file = path.join("input", input);

	//console.log("", `Processing ${input}`, "")

	// read each file and add everything
	fs.createReadStream(file)
		.pipe(csv())
		.on("data", data => {
			try {
				if(data.Name == "Type") {
					Object.keys(data).forEach(key => {
						if(key != "Name") {
							output[key] = {
								"name": key,
								"type": data[key],
								"source": {
									"owner": "Kualan"
								},
								"tags": ["source:Heroes on Both Sides", ...tagMap[input]]
							};
						}
					});
				}
				else if(outputKeys.indexOf(data.Name.toLowerCase()) != -1) {
					chunk = data.Name.toLowerCase();
				}
				else {
					Object.keys(data).forEach(key => {
						if(key != "Name") {
							if(!(chunk in output[key])) {
								switch(chunk) {
									case "gear":
									case "talents":
									case "abilities":
										output[key][chunk] = [];
										break;

									// tags key has already been created
									case "tags":
										break;

									default:
										output[key][chunk] = {};
								}
							}

							if(data[key]) {
								let name = data.Name in keyMap ? keyMap[data.Name] : data.Name;

								switch(chunk) {
									case "gear":
									case "talents":
									case "abilities":
									case "tags":
										output[key][chunk].push(data[key]);
										break;

									default:
										output[key][chunk][name] = data[key];
								}
							}
						}
					})
				}
			}
			catch(err) {
				console.error(err)
			}
		})
		.on("end",() => {
			Object.keys(output).forEach(key => {
				let adv = output[key];

				// weapons and custom weapons
				adv.weapons = adv.gear.filter(g => g in customWeapons).map(g => customWeapons[g]);
				adv.weapons = adv.weapons.concat(adv.gear.filter(g => WEAPONS.indexOf(g) != -1));
				adv.gear = adv.gear.filter(g => adv.weapons.indexOf(g) == -1).join(", ");

				adv.abilities = adv.abilities.map(ab => {
					if(ab.startsWith("Force Power")) {
						let key = ab.replace(/[:\s]+/g, "-").toLowerCase();
						let keyName = key + "-" + adv.name.replace(/\s+/g, "-").replace(/[\(\)]/g, "").toLowerCase();

						if(keyName in abilities) {
							return abilities[keyName];
						}

						return abilities[key + "-hobs"];
					}

					return (ab in abilities) ? abilities[ab] : ab;
				});

				adv.derived.defence = [
				   adv.derived["Melee Defence"],
				   adv.derived["Ranged Defence"]
				];

				delete adv.derived["Melee Defence"];
				delete adv.derived["Ranged Defence"];

				finalOutput.push(adv);
			});

			complete();
		});
});
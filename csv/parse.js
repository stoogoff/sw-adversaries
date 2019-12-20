
"use strict";

const fs = require("fs"); 
const path = require("path"); 
const csv = require("csv-parser");
const ABILITIES = require("./data/abilities.json");
const FORCE_POWERS = require("./data/force-powers.json");

const args = process.argv.slice(2);

if(args.length === 0) {
	console.error("File name must be provided.");
	process.exit();
}

const INPUT = path.join("data", args[0]);

let output = {};
let outputKeys = [
	"characteristics",
	"derived",
	"skills",
	"talents",
	"abilities",
	"gear"
];
let chunk = null;
let keyMap = {
	"Soak": "soak",
	"Wound Threshold": "wounds",
	"Strain Threshold": "strain"
};
let tagMap = {
	"jedi.csv": ["jedi", "force sensitive"]
};

// convert abilities and force powers to name/id as key
let abilities = {};

ABILITIES.forEach(a => abilities[a.name] = a);
FORCE_POWERS.map(m => {
	delete m.character;

	return m;
}).forEach(a => abilities[a.id.toLowerCase()] = a);

fs.createReadStream(INPUT)
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
							"tags": ["source:Heroes on Both Sides", ...tagMap[args[0]]]
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
		let finalOutput = [];

		Object.keys(output).forEach(key => {
			let adv = output[key];

			adv.gear = adv.gear.join(", ");
			adv.abilities = adv.abilities.map(ab => {
				if(ab.startsWith("Force Power")) {
					let key = ab.replace(/[:\s]{1,}/g, "-").toLowerCase();
					let keyName = key + "-" + adv.name.replace(" ", "-").toLowerCase();

					if(keyName in abilities) {
						return abilities[keyName];
					}

					return abilities[key + "-hobs"];
				}

				return (ab in abilities) ? abilities[ab] : ab;
			});

			finalOutput.push(adv);
		});

		//console.log(finalOutput);
		console.log(JSON.stringify(finalOutput, null, 1).trim());
	});

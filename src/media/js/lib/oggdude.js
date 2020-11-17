
import * as CONFIG from "./config"


let KEY_TO_SKILLS = null;
let KEY_TO_TALENTS = null;

export const parseXML = function parse(xml, skills, talents) {
	if(!KEY_TO_SKILLS) {
		KEY_TO_SKILLS = {};
		skills.map(skill => KEY_TO_SKILLS[skill.key] = skill.name);
	}

	if(!KEY_TO_TALENTS) {
		KEY_TO_TALENTS = {};
		talents.map(talent => KEY_TO_TALENTS[talent.key] = talent.name);
	}

	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xml, CONFIG.MIMETYPE_XML);

	const parsed = nodeToObject(xmlDoc.documentElement.childNodes);

	console.log("PARSED", parsed)

	return convertToSWA(parsed);
};


function convertToSWA(parsed) {
	const converted = {
		derived: {},
		characteristics: {}
	};

	// convert some oggdude properties to lowercase
	[
		"Description", "Gear", "Name", "Type", "Weapons"
	].filter(prop => prop in parsed).forEach(prop => converted[prop.toLowerCase()] = parsed[prop]);

	// convert derived attributes
	[
		{ "key": "SoakValue", "value": "soak" },
		{ "key": "WoundThreshold", "value": "wounds" },
		{ "key": "StrainThreshold", "value": "strain" },
		{ "key": "DefenseRanged", "value": "defenceRanged" },
		{ "key": "DefenseMelee", "value": "defenceMelee" },
	].filter(kvp => kvp.key in parsed.Attributes).forEach(kvp => converted.derived[kvp.value] = getRanks(parsed.Attributes[kvp.key]));

	converted.derived.defence = [
		converted.derived.defenceMelee || 0,
		converted.derived.defenceRanged || 0
	];

	delete converted.derived.defenceMelee;
	delete converted.derived.defenceRanged;

	// set characteristic properties
	parsed.Characteristics.forEach(char => {
		converted.characteristics[char.Name] = getRanks(char.Rank);
	});

	// set skill values
	if(converted.type === "Minion") {
		converted.skills = Object.values(parsed.Skills).map(skill => KEY_TO_SKILLS[skill.Key]);
	}
	else {
		converted.skills = {};

		parsed.Skills.forEach(skill => {
			converted.skills[KEY_TO_SKILLS[skill.Key]] = getRanks(skill.Rank);
		});
	}

	["Abilities", "Talents"].forEach(t => {
		if(parsed[t]) {
			converted[t.toLowerCase()] = Object.values(parsed[t]).map(talent => KEY_TO_TALENTS[talent.Key]);
		}
	});

	return converted;
}

function getRanks(obj) {
	return ["ItemRanks", "CharRanks", "PurchasedRanks", "StartingRanks"]
		.filter(rank => rank in obj)
		.map(rank => parseInt(obj[rank]))
		.reduce((acc, val) => acc + val, 0);
}

function nodeToObject(nodeList) {
	let obj = {};

	for(let i = 0, len = nodeList.length; i < len; ++i) {
		const node = nodeList[i];

		if(node.nodeType === Node.ELEMENT_NODE) {
			if(Array.isArray(obj)) {
				obj.push(nodeToObject(node.childNodes))
			}
			else if(node.nodeName in obj) {
				const existing = obj[node.nodeName];

				obj = []
				obj.push(existing)
				obj.push(nodeToObject(node.childNodes))
			}
			else {
				obj[node.nodeName] = nodeToObject(node.childNodes);
			}
		}
		else if(node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
			return node.nodeValue;
		}
	}

	return obj;
}

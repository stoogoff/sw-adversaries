
# Star Wars: Adversaries

A simple web app for looking up adversaries for the FFG's Star Wars RPG. See it in action here: http://swa.stoogoff.com/.

Built using:

- [Babel](https://babeljs.io)
- [React](https://facebook.github.io/react/)
- [Gulp](http://gulpjs.com/)
- Icons by [IcoMoon](https://icomoon.io/app/)
- Dice font from [The Alexandrian](http://thealexandrian.net/wordpress/37660/roleplaying-games/star-wars-force-and-destiny-system-cheat-sheet)

## Structure

- build - build using gulp and babel
- dev - development version, created by gulp
- live - live version, created by gulp, everything is minified
- src - source code
	- src/media - all assets
		- src/media/data - JSON files containing adversary data
		- src/media/fonts - Star Wars dice font
		- src/media/js - all javascript
			- src/media/js/components - React components
			- src/media/js/lib - config and utilities
		- src/media/sass - sass stylesheet

## Install and Build

In the build directory run `npm install`. Once everything has installed run any of the following:

- `gulp dev clean` Delete the dev directory and start afresh.
- `gulp dev build` Completely build the project into the dev directory.
- `gulp watch` Watch files for changes and rebuild as necessary.

For Windows:

- Download npm from https://nodejs.org/en/download/.
- Add C:\Program Files\nodejs\ to your path.
- Switch to your build directory and run `npm install`.
- Then run `npm install react@15.6.1`, and then `npm install react-dom@15.6.1`.
- To build from the build directory, run node_modules\.bin\gulp dev build, or node_modules\.bin\gulp live build.

## Gulp

Main tasks:

`live` Output to the live directory and minify Javascript and CSS.

`dev` Output to the dev directory as is. This is the default action.

`clean` Delete the output directory.

`build` Build everything and save to the output directory.

`watch` After the `dev` task has completed watch all HTML, JS, SASS and JSON files for changes.

`deploy` After the `live` task has completed deploy to an AWS bucket. Target and authentication details need to be placed in a file called aws.json in the build directory. The format for this is:

``` JSON
{
	"key": "AUTH_KEY",
	"secret": "AUTH_SECRET",
	"bucket": "BUCKET_NAME",
	"region": "REGION"
}

```

## Completed Adversaries

- core books
	- Age of Rebellion
	- Edge of the Empire
	- Force and Destiny
- gm kits
	- EotE (Debts to Pay)
	- AoR (Dead in the water)
	- Fad (Hidden Depths)
- source books
	- Lords of Nal Hutta
	- Strongholds of Resistance
	- Suns of Fortune
	- Nexus of Power
- career books
	- *Dangerous Covenants (no stats)*
	- Desparate Allies
	- Endless Vigil
	- Far Horizons
	- *Fly Casual (no stats)*
	- *Forged in Battle (no stats)*
	- Keeping the Peace
	- Lead by Example
	- *No Disintegrations (no stats)*
	- Savage Spirits
	- Special Modifications
	- Stay on Target
- beginner's games
	- Age of Rebellion (Takeover at Whisper Base)
	- Edge of the Empire (Escape from Mos Shuuta)
- adventure books
	- Beyond the Rim
	- Chronicles of the Gatekeeper
	- Jewel of Yavin
	- Friends Like These
	- Ghosts of Dathomir
	- Mask of the Pirate Queen
	- Onslaught at Arda I
	- Rescue at Glare Peak
	- Under a Black Sun
- adventures
	- A Deal Gone Wrong
	- A Quick Stopover
	- Beyond the Boiling Sea
	- Beyond the Rim
	- Chronicles of the Gatekeeper
	- Claustrophobia
	- Conical Six Summit
	- Dead in the Water (AoR GM Kit)
	- Debts to Pay (EotE GM Kit)
	- Escape from Mos Shuuta
	- Exploring the Acablas Ruins
	- Friends Like These
	- Ghosts of Dathomir
	- Hard Bargain
	- Hidden Depths (FaD GM Kit)
	- If It Sounds too Good to be True...
	- In Too Deep
	- Jewel of Yavin
	- Lessons from the Past
	- Long Arm of the Law
	- Lost Knowledge (FaD Beta adventure)
	- Mask of the Pirate Queen
	- Onslaught at Arda I
	- Operation Shadowpoint (AoR follow on adventure)
	- Operation: Shell Game (AoR Beta game)
	- Perlemian Haul
	- Phantoms in the Dark
	- Rescue at Glare Peak
	- Rubbing Slimy Elbows
	- Sabacc Game on the Row
	- Taming the Dragon
	- Takeover at Whisper Base
	- The Corellian Shuffle
	- The Dead Road
	- The Geharr Incident
	- The Long Arm of the Hutt (EotE follow on adventure)
	- The Light Within
	- The Menagerie
	- The Trial of Skill
	- Toydarian Grocery Shopping
	- Trouble Brewing
	- Tunnel Delving
	- Under a Black Sun
	- Vault of Justice
	- Welcome Aboard
	- Witch’s Wrath
	- Force and Destiny (Mountaintop Rescue)
	- Lure of the Lost (FaD follow on adventure)

### Missing Adversaries

- source books
	- *Dawn of Rebellion (not released)*
- career books
	- EotE
		- Enter the Unknown (5 droids)
	- AoR
		- Fully Operational
		- *Cyphers and Masks (not released)*
	- FaD
		- Disciples of Harmony
		- *Unlimited Power (not released)*
- beginner's games
	- The Force Awakens
	- A Call for Heroes (TFA Bonus adventure)
	- Crates of Krayts (EotE Beta adventure)

## TODO

- Favicon
- Links between adversaries
- Proper force pips rather than using the light side icon
- Upgraded difficulties
- Print multiple tabs


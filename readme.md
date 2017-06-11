
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

## TODO

- More adversaries
	- core books (DONE)
		- Age of Rebellion
		- Edge of the Empire
		- Force and Destiny
	- source books
		- Lords of Nal Hutta
		- Strongholds of Resistance
		- **Suns of Fortune (there's a barabel enforcer with different weapon load out)**
		- Nexus of Power
	- career books
		- *Dangerous Covenants (no stats)*
		- Desparate Allies
		- Endless Vigil
		- Far Horizons
		- *Fly Casual (no stats)*
		- Keeping the Peace
		- Special Modifications
		- Stay on Target
		- **Savage Spirits (incomplete)**
	- adventure books
		- Chronicles of the Gatekeeper
		- Friends Like These
		- Rescue at Glare Peak
		- Under a Black Sun
- Favicon
- Links between adversaries
- Proper force pips rather than using the light side icon
- Upgraded difficulties
- Print multiple tabs
- Better tab handling:
	- Labels (text and colour)
	- Delete as part of the label

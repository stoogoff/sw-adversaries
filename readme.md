
# Star Wars: Adversaries

A simple web app for looking up adversaries for the FFG's Star Wars RPG. See it in action here: http://swa.stoogoff.com/.

Built using:

- [Babel](https://babeljs.io)
- [React](https://facebook.github.io/react/)
- [Gulp](http://gulpjs.com/)
- Icons by [FontAwesome](http://fontawesome.io/)
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
- Tracking of Wounds and Strain
- Mobile friendly
- Favourite adversaries

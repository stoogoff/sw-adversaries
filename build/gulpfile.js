
// requires
const path = require("path");
const fs = require("fs");

// gulp requires
const gulp = require("gulp");
const clean = require("gulp-clean");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const combine = require("gulp-jsoncombine");
const merge = require("merge-stream");
const preprocess = require("gulp-preprocess");
const s3 = require("gulp-s3");
const gzip = require("gulp-gzip");

// current app version
const VERSION = fs.readFileSync(path.join(__dirname, "VERSION"), "utf8");


console.log(`\nBuilding version: ${VERSION}.\n`);


// global config
let isDev = true;
const TARGET = {
	src: function(p) {
		return path.join("../src", p);
	},
	dest: function(p) {
		let target = isDev ? "../dev" : "../live";

		if(p != "" && p != "**") {
			target = path.join(target, VERSION);
		}

		return path.join(target, p);
	},
	module: function(p) {
		return TARGET.root(path.join("node_modules", p));
	},
	root: function(p) {
		return path.join(__dirname, p);
	}
};


// completely clear out the base directory
gulp.task("clean", () => {
	return gulp.src(TARGET.dest(""), {
		read: false
	}).pipe(clean({
		force: true
	}));
});

// sass task
gulp.task("sass", () => {
	return gulp.src(TARGET.src("/media/sass/*.sass"))
		.pipe(sass({
			indentedSyntax: true,
			outputStyle: isDev ? "expanded" : "compressed"
		}).on("error", sass.logError))
		.pipe(gulp.dest(TARGET.dest("media/css/")));
});


// use babel to convert js
gulp.task("transpile-js", () => {
	return gulp.src(TARGET.src("media/js/**/*.*"))
		.pipe(babel({
			//presets: [TARGET.module("babel-preset-es2015"), TARGET.module("babel-preset-react")],
			//plugins: [TARGET.module("babel-plugin-transform-es2015-modules-systemjs")],
			presets: ["@babel/preset-env", "@babel/preset-react"],
			minified: !isDev
		}))
		.pipe(gulp.dest(TARGET.dest("media/js")));
});

// merge folders of json data into a single file
gulp.task("merge-data", () => {
	let mapped = ["adversaries", "qualities", "talents"].map(function(m) {
		return gulp.src(TARGET.src("media/data/" + m + "/*.json")).pipe(combine(m + ".json", function(data, metaData) {
			// add the file the adversary is in in dev mode only
			if(isDev && m == "adversaries") {
				Object.keys(data).forEach(k => {
					data[k].forEach(o => {
						o.tags.push("file:" + k + ".json");
					});
				});
			}

			// add the source of the talent as the type, so the UI can distinguish between talents, gifts and force powers
			if(m == "talents") {
				Object.keys(data).forEach(function(k) {
					data[k].forEach(o => {
						o.type = k;
					});
				});
			}

			let output = [];

			for(let i in data) {
				output = output.concat(data[i]);
			}

			if(!isDev && m == "adversaries") {
				output.forEach(item => {
					if("description" in item) {
						delete item["description"];
					}
				});

				output = output.filter(a => !("devOnly" in a && a["devOnly"]));
			}

			// adversaries now use a string for gear instead of an array
			// for now, convert this during the build
			if(m == "adversaries") {
				output.forEach(item => {
					if("gear" in item && Array.isArray(item.gear)) {
						item.gear = item.gear.join(", ");
					}
				});
			}

			// remove talents which don't have a description
			if(m == "talents") {
				output = output.filter(t => t.description != "");
			}

			return new Buffer(JSON.stringify(output));
		})).pipe(gulp.dest(TARGET.dest("media/data/")));
	});

	return merge.apply(null, mapped);
});

// copy js libs
gulp.task("copy-vendor", () => {
	let modules = [
		TARGET.module("systemjs/dist/system.js"),
		TARGET.module("@babel/polyfill/dist/polyfill.js"),
		TARGET.module("react/umd/react.production.min.js"),
		TARGET.module("react-dom/umd/react-dom.production.min.js"),
		TARGET.module("remarkable/dist/remarkable.min.js")
	];

	return gulp.src(modules).pipe(gulp.dest(TARGET.dest("media/js/vendor")));
});


gulp.task("copy-data", gulp.series("merge-data", () => {
	return gulp.src(TARGET.src("media/data/*.json")).pipe(gulp.dest(TARGET.dest("media/data")));
}));

// copy static html files and font files
gulp.task("copy-static", () => {
	return gulp.src(TARGET.src("index.html"))
		.pipe(preprocess({
			context: {
				ENV_LIVE: !isDev,
				ENV_VERSION: VERSION
			}
		}))
		.pipe(gulp.dest(TARGET.dest("")));
});

gulp.task("copy-font", () => {
	return gulp.src(TARGET.src("media/fonts/**")).pipe(gulp.dest(TARGET.dest("media/fonts")));
});

gulp.task("live", (done) => {
	console.log("Running in LIVE context");
	isDev = false;
	done();
});

// for completeness, dev is the default
gulp.task("dev", (done) => {
	console.log("Running in DEV context");
	isDev = true;
	done();
});

// build everyting, dev or live should've been run first but dev is the default
gulp.task("build", gulp.series("transpile-js", "copy-vendor", "copy-data", "copy-static", "copy-font", "sass", (done) => done()));

gulp.task("watch", gulp.series("dev", () => {
	gulp.watch(TARGET.src("/index.html"), ["copy-static"]);
	gulp.watch(TARGET.src("/media/sass/**"), ["sass"]);
	gulp.watch(TARGET.src("/media/data/**"), ["copy-data"]);
	gulp.watch(TARGET.src("/media/js/**"), ["transpile-js"]);
}));

// deploy everything to an Amazon S3 bucket
gulp.task("deploy", gulp.series("live", () => {
	const LAST_VERSION_PATH = path.join(__dirname, "LAST_VERSION");
	const LAST_VERSION = fs.existsSync(LAST_VERSION_PATH) ? fs.readFileSync(LAST_VERSION_PATH, "utf8") : "1.0.0";

	if(VERSION === LAST_VERSION) {
		throw `Failed to deploy: VERSION ${VERSION} matches LAST_VERSION ${LAST_VERSION}`;
	}

	// write new version file
	fs.writeFile(LAST_VERSION_PATH, VERSION, "utf8", err => {
		if(err) {
			throw err;
		}
	});

	let aws = require("./aws.json");

	return gulp.src(TARGET.dest("**"))
		.pipe(gzip())
		.pipe(s3(aws, {
			gzippedOnly: true
		}));
}));

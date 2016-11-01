
// requires
var gulp = require("gulp");
var clean = require("gulp-clean");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var combine = require("gulp-jsoncombine");
var merge = require("merge-stream");
var preprocess = require("gulp-preprocess");
var s3 = require("gulp-s3");
var gzip = require("gulp-gzip");


// global config
var isDev = true;
var path = {
	src: function(p) {
		return "../src/" + p;
	},
	dest: function(p) {
		return (isDev ? "../dev/" : "../live/") + p;
	},
	module: function(p) {
		return path.root("/node_modules/" + p);
	},
	root: function(p) {
		return __dirname + p;
	}
};


// completely clear out the base directory
gulp.task("clean", function() {
	return gulp.src(path.dest(""), {
		read: false
	}).pipe(clean({
		force: true
	}));
});

// sass task
gulp.task("sass", function() {
	return gulp.src(path.src("/media/sass/*.sass"))
		.pipe(sass({
			indentedSyntax: true,
			outputStyle: isDev ? "expanded" : "compressed"
		}).on("error", sass.logError))
		.pipe(gulp.dest(path.dest("media/css/")));
});


// use babel to convert js
gulp.task("transpile-js", function() {
	return gulp.src(path.src("media/js/**/*.*"))
		.pipe(babel({
			presets: [path.module("babel-preset-es2015"), path.module("babel-preset-react")],
			plugins: [path.module("babel-plugin-transform-es2015-modules-systemjs")],
			minified: !isDev
		}))
		.pipe(gulp.dest(path.dest("media/js")));
});

// merge folders of json data into a single file
gulp.task("merge-data", function() {
	var mapped = ["adversaries", "qualities", "talents"].map(function(m) {
		return gulp.src(path.src("media/data/" + m + "/*.json")).pipe(combine(m + ".json", function(data, metaData) {
			var output = [];

			for(var i in data) {
				output = output.concat(data[i]);
			}

			if(!isDev && m == "adversaries") {
				for(var i = 0, len = output.length; i < len; ++i) {
					if("description" in output[i]) {
						output[i]["description"] = "";
					}
				}
			}

			return new Buffer(JSON.stringify(output));
		})).pipe(gulp.dest(path.dest("media/data/")));
	});

	return merge.apply(null, mapped);
});

// copy js libs
gulp.task("copy-vendor", function() {
	var modules = [
		path.module("systemjs/dist/system.js"),
		path.module("babel-polyfill/dist/polyfill.js"),
		path.module("react/dist/react.js"),
		path.module("react-dom/dist/react-dom.js")
	];

	return gulp.src(modules).pipe(gulp.dest(path.dest("media/js/vendor")));
});


gulp.task("copy-data", ["merge-data"], function() {
	return gulp.src(path.src("media/data/*.json")).pipe(gulp.dest(path.dest("media/data")));
});

// copy static html files and font files
gulp.task("copy-static", function() {
	return gulp.src(path.src("index.html"))
		.pipe(preprocess({
			context: {
				ENV_LIVE: !isDev
			}
		}))
		.pipe(gulp.dest(path.dest("")));
});

gulp.task("copy-font", function() {
	return gulp.src(path.src("media/fonts/**")).pipe(gulp.dest(path.dest("media/fonts")));
});

gulp.task("live", function() {
	console.log("Running in LIVE context");
	isDev = false;
});

// for completeness, dev is the default
gulp.task("dev", function() {
	console.log("Running in DEV context");
	isDev = true;
});

// build everyting, dev or live shoudl've been run first but dev is the default
gulp.task("build", ["transpile-js", "copy-vendor", "copy-data", "copy-static", "copy-font", "sass"]);

gulp.task("watch", ["dev"], function() {
	gulp.watch(path.src("/index.html"), ["copy-static"]);
	gulp.watch(path.src("/media/sass/**"), ["sass"]);
	gulp.watch(path.src("/media/data/**"), ["copy-data"]);
	gulp.watch(path.src("/media/js/**"), ["transpile-js"]);
});

// deploy everything to an Amazon S3 bucket
gulp.task("deploy", ["live"], function() {
	var aws = require("./aws.json");

	return gulp.src(path.dest("**"))
		.pipe(gzip())
		.pipe(s3(aws, {
			gzippedOnly: true
		}));
});

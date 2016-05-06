/**
 * MEH gulp
 */

// 'use strict';

var fs = require('graceful-fs');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var gulpLoadPlugins = require('gulp-load-plugins');
var postcss = require('gulp-postcss');
var babel = require('gulp-babel');
var oldie = require('oldie');
var autoPrefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var postcssFlex = require('postcss-flexibility');
var perfectionist = require('perfectionist');

var $ = gulpLoadPlugins();
var reload = browserSync.reload;

var SASS_PATHS = [
	'src/motion-ui/src',
	'src/styles'
];

var AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'last 2 ff versions',
	'last 2 chrome versions',
	'last 2 edge versions',
	'last 2 safari versions',
	'last 2 opera versions',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

var POSTCSS_PLUGINS = [
	autoPrefixer({
		browsers: AUTOPREFIXER_BROWSERS
	}),
	perfectionist({
		cascade: false
	})
];

var POSTCSS_IE = [
	autoPrefixer({
		browsers: ['IE 8', 'IE 9']
	}),
	postcssFlex,
	oldie,
	perfectionist({
		cascade: false
	})
];

var SOURCESJS = [
	// ** MDL ** //
	// Component handler
	'src/scripts/vendors/mdlComponentHandler.js',

	// ** Vendors ** //
	'src/scripts/vendors/steer.js',
	// ** Mine ** //
	'src/scripts/myjs/Dropdown.js',
	'src/scripts/myjs/main.js',
	'src/scripts/es6.js'
];

// Scripts that rely on jQuery
var SOURCESJQ = [
	'src/scripts/myjs/jq-main.js'
];

// ***** Development tasks ****** //
// Lint JavaScript
gulp.task('lint', function() {
	gulp.src('src/scripts/*.js')
		.pipe(xo())
});

// ***** Production build tasks ****** //
// Optimize images
gulp.task('images', function() {
	gulp.src('src/images/**/*.{svg,png,jpg}')
	.pipe($.imagemin({
		progressive: true,
		interlaced: true,
		svgoPlugins: [{
                cleanupIDs: true
            }, {
                removeTitle: true
            }, {
				addClassesToSVGElement: {
					className: 'v-icon'
				}
			}, {
                removeUselessStrokeAndFill: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }, {
				removeNonInheritableGroupAttrs: true
			}, {
                removeDimensions: true
            }]
	}))
	.pipe(gulp.dest('images'))
	.pipe($.size({title: 'images'}))
});

// Compile and Automatically Prefix Stylesheets (production)
gulp.task('styles', function() {
	gulp.src('src/styles/style.scss')
		// Generate Source Maps
		.pipe(sourcemaps.init())
		.pipe($.sass({
			includePaths: SASS_PATHS,
			precision: 10,
			onError: console.error.bind(console, 'Sass error:')
		}))
		.pipe(gulp.dest('.tmp'))
		.pipe($.concat('style.css'))
		.pipe(postcss(POSTCSS_PLUGINS))
		.pipe(gulp.dest('./'))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.concat('style.min.css'))
		.pipe($.size({title: 'styles'}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('./'))
});

gulp.task('oldie', function() {
	gulp.src('.tmp/style.css')
		.pipe(postcss(POSTCSS_IE))
		.pipe($.concat('oldie.css'))
		.pipe(gulp.dest('css'))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.concat('oldie.min.css'))
		.pipe(gulp.dest('css'))
});

// Concatenate And Minify JavaScript
gulp.task('scripts', function() {
	gulp.src(SOURCESJS)
		.pipe(sourcemaps.init())
		.pipe(babel({
			"presets": ["es2015"],
			"only": [
				"src/scripts/es6.js"
			]
		}))
		.pipe($.concat('main.js'))
		.pipe(gulp.dest('js'))
		.pipe($.concat('main.min.js'))
		.pipe($.uglify())
		.pipe($.size({
			title: 'scripts'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('js'))
});

// Concatenate And Minify JavaScript
gulp.task('jq_scripts', function() {
	gulp.src(SOURCESJQ)
		.pipe($.concat('jq-main.js'))
		.pipe(gulp.dest('js'))
		.pipe($.uglify())
		.pipe($.concat('jq-main.min.js'))
		.pipe(gulp.dest('js'))
		.pipe($.size({
			title: 'jq_scripts'
		}))
});

/**
 * Defines the list of resources to watch for changes.
 */
// Build and serve the output
gulp.task('serve', ['scripts', 'styles'], function() {
	browserSync.init({
		// proxy: "local.wordpress.dev"
		// proxy: "local.wordpress-trunk.dev"
		proxy: 'rcdoc.dev'
			// proxy: "127.0.0.1:8080/wordpress/"
	});

	gulp.watch(['*/**/*.php'], reload);
	gulp.watch(['src/**/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['src/**/*.js'], ['lint', 'scripts']);
	gulp.watch(['src/images/**/*'], reload);
});

// Build production files, the default task
gulp.task('default', function(cb) {
	runSequence(
		'styles', ['oldie', 'scripts', 'jq_scripts', 'images'],
		cb);
});

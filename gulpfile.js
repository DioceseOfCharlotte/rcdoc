/**
 * MEH gulp
 */

// 'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var gulpLoadPlugins = require('gulp-load-plugins');
var postcss = require('gulp-postcss');
var babel = require('gulp-babel');
var xo = require('gulp-xo');
var autoPrefixer = require('autoprefixer');
var postcssFlex = require('postcss-flexibility');
// var postcssScss = require('postcss-scss');
// var postcssNested = require('postcss-nested');
// var precss = require('precss');

var $ = gulpLoadPlugins();
var reload = browserSync.reload;

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
	})
	// postcssFlex
];

var SOURCESJS = [
	// ** MDL ** //
	// Component handler
	'src/mdl/mdlComponentHandler.js',
	// Polyfills/dependencies
	// 'src/mdl/third_party/**/*.js',
	// Base components
	'src/mdl/button/button.js',
	// 'src/checkbox/checkbox.js',
	// 'src/mdl/icon-toggle/icon-toggle.js',
	'src/mdl/menu/menu.js',
	// 'src/progress/progress.js',
	// 'src/radio/radio.js',
	// 'src/slider/slider.js',
	// 'src/mdl/snackbar/snackbar.js',
	// 'src/spinner/spinner.js',
	// 'src/mdl/switch/switch.js',
	'src/mdl/tabs/tabs.js',
	// 'src/mdl/textfield/textfield.js',
	// 'src/mdl/tooltip/tooltip.js',
	// Complex components (which reuse base components)
	// 'src/mdl/layout/layout.js',
	// 'src/data-table/data-table.js',
	'src/mdl/ripple/ripple.js',

	// 'src/js/bliss.js',
	// ** GSAP ** //
	'src/js/vendors/TweenMax.js',
	// 'src/js/MorphSVGPlugin.js',
	// 'src/js/DrawSVGPlugin.js',
	// ** ScrollMagic ** //
	// 'src/js/ScrollMagic.js',
	// 'src/js/animation.gsap.js',
	// ** Flickity ** //
	'src/js/vendors/flickity.pkgd.js',
	'src/js/vendors/headroom.js',
	// ** Mine ** //
	'src/js/myjs/Dropdown.js',
	// 'src/js/myjs/Morph.js',
	'src/js/myjs/main.js',
	'src/js/es6.js'
];

// Scripts that rely on jQuery
var SOURCESJQ = [
	'src/js/myjs/jq-main.js'
];

// ***** Development tasks ****** //
// Lint JavaScript
gulp.task('lint', function () {
	gulp.src('src/scripts/*.js')
	.pipe(xo())
});

// ***** Production build tasks ****** //
// Optimize images
gulp.task('images', function () {
	gulp.src('src/images/**/*.{svg,png,jpg}')
	.pipe($.cache($.imagemin({
		progressive: true,
		interlaced: true
	})))
	.pipe(gulp.dest('images'))
	.pipe($.size({
		title: 'images'
	}))
});

// Compile and Automatically Prefix Stylesheets (production)
gulp.task('styles', function () {
	// For best performance, don't add Sass partials to `gulp.src`
	gulp.src('src/style.scss')
		// Generate Source Maps
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			precision: 10,
			onError: console.error.bind(console, 'Sass error:')
		}))
		.pipe(postcss(POSTCSS_PLUGINS))
		.pipe(gulp.dest('.tmp'))
		.pipe($.concat('style.css'))
		.pipe(gulp.dest('./'))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.concat('style.min.css'))
		.pipe($.size({title: 'styles'}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('./'));
});

// Concatenate And Minify JavaScript
gulp.task('scripts', function () {
	gulp.src(SOURCESJS)
	.pipe($.sourcemaps.init())
	.pipe(babel({
		"presets": ["es2015"],
		"only": [
			"src/js/es6.js"
		]
	}))
	.pipe($.concat('main.js'))
	.pipe($.sourcemaps.write())
	.pipe(gulp.dest('js'))
	.pipe($.concat('main.min.js'))
	.pipe($.uglify())
	.pipe($.size({title: 'scripts'}))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('js'))
});

// Concatenate And Minify JavaScript
gulp.task('jq_scripts', function () {
	gulp.src(SOURCESJQ)
	.pipe($.sourcemaps.init())
	// .pipe($.babel())
	.pipe($.concat('jq-main.js'))
	.pipe(gulp.dest('js'))
	.pipe($.uglify())
	.pipe($.concat('jq-main.min.js'))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest('js'))
	.pipe($.size({title: 'jq_scripts'}))
});

/**
 * Defines the list of resources to watch for changes.
 */
// Build and serve the output
gulp.task('serve', ['scripts', 'styles'], function () {
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
gulp.task('default', function (cb) {
	runSequence(
		'styles', ['scripts', 'jq_scripts', 'images'],
		cb);
});

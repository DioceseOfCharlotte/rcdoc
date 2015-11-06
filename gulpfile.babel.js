/**
 * MEH gulp
 */

//'use strict';

 import fs from 'fs';
 import path from 'path';

import del from 'del';

import runSequence from 'run-sequence';
import browserSync from 'browser-sync';


import gulp from 'gulp';

import gulpLoadPlugins from 'gulp-load-plugins';

import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;



const AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.2',
  'bb >= 10'
];

const MDLSOURCES = [
  // Component handler
  'assets/src/mdl/mdlComponentHandler.js',
  // Polyfills/dependencies
  'assets/src/mdl/third_party/**/*.js',
  // Base components
  'assets/src/mdl/button/button.js',
  //'src/checkbox/checkbox.js',
  'assets/src/mdl/icon-toggle/icon-toggle.js',
  'assets/src/mdl/menu/menu.js',
  //'src/progress/progress.js',
  //'src/radio/radio.js',
  //'src/slider/slider.js',
  //'assets/src/mdl/snackbar/snackbar.js',
  //'src/spinner/spinner.js',
  //'assets/src/mdl/switch/switch.js',
  'assets/src/mdl/tabs/tabs.js',
  'assets/src/mdl/textfield/textfield.js',
  //'assets/src/mdl/tooltip/tooltip.js',
  // Complex components (which reuse base components)
  'assets/src/mdl/layout/layout.js',
  //'src/data-table/data-table.js',
  // And finally, the ripples
  'assets/src/mdl/ripple/ripple.js'
];

const GSSOURCES = [
  'assets/src/js/TweenMax.min.js',
  'assets/src/js/MorphSVGPlugin.min.js',
  'assets/src/js/DrawSVGPlugin.min.js',
];

// ***** Development tasks ****** //

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src('assets/src/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
);


// ***** Production build tasks ****** //

// Optimize Images
// TODO: Update image paths in final CSS to match root/images
gulp.task('images', () =>
  gulp.src('assets/src/**/*.{svg,png,jpg}')
    .pipe($.flatten())
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('images'))
    .pipe($.size({title: 'images'}))
);


// Compile and Automatically Prefix Stylesheets (production)
gulp.task('styles', () => {
  // For best performance, don't add Sass partials to `gulp.src`
  gulp.src('assets/src/style.scss')
    // Generate Source Maps
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    //.pipe($.cssInlineImages({webRoot: 'src'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate Styles
    .pipe($.concat('style.css'))
    .pipe(gulp.dest('./'))
    // Minify Styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.concat('style.min.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe($.size({title: 'all_styles'}));
});


// Concatenate And Minify JavaScript
gulp.task('mdl_scripts', () =>
  gulp.src(MDLSOURCES)
  .pipe($.sourcemaps.init())
  .pipe($.babel())
  .pipe($.sourcemaps.write())
    // Concatenate Scripts
    .pipe($.concat('material.js'))
    .pipe(gulp.dest('assets/js'))
    // Minify Scripts
    .pipe($.uglify({
      sourceRoot: '.',
      sourceMapIncludeSources: true
    }))
    .pipe($.concat('material.min.js'))
    // Write Source Maps
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js'))
    .pipe($.size({title: 'mdl_scripts'}))
);

// Concatenate And Minify JavaScript
gulp.task('gs_scripts', () =>
  gulp.src(GSSOURCES)
  .pipe($.sourcemaps.init())
  //.pipe($.babel())
  .pipe($.sourcemaps.write())
    // Concatenate Scripts
    .pipe($.concat('gsap.js'))
    .pipe(gulp.dest('assets/js'))
    // Minify Scripts
    .pipe($.uglify({
      sourceRoot: '.',
      sourceMapIncludeSources: true
    }))
    .pipe($.concat('gsap.min.js'))
    // Write Source Maps
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js'))
    .pipe($.size({title: 'gs_scripts'}))
);


/**
 * Defines the list of resources to watch for changes.
 */
 // Build and serve the output
gulp.task('serve', ['styles'], function() {
 	browserSync.init({
 		//proxy: "local.wordpress.dev"
 		//proxy: "local.wordpress-trunk.dev"
 		//proxy: "stmark.dev"
 		proxy: "doc.dev"
 		//proxy: "127.0.0.1:8080/wordpress/"
 	});

	gulp.watch(['src/**/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['src/**/*.js'], ['scripts', reload]);
	//gulp.watch(['assets/src/images/**/*'], reload);
	gulp.watch(['*/**/*.php'], reload);
});


// Build production files, the default task
gulp.task('default', cb => {
  runSequence(
    'styles',
    ['mdl_scripts', 'gs_scripts'],
    cb);
});

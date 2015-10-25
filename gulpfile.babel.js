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
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const SOURCES = [
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
  'assets/src/mdl/snackbar/snackbar.js',
  //'src/spinner/spinner.js',
  'assets/src/mdl/switch/switch.js',
  'assets/src/mdl/tabs/tabs.js',
  'assets/src/mdl/textfield/textfield.js',
  'assets/src/mdl/tooltip/tooltip.js',
  // Complex components (which reuse base components)
  'assets/src/mdl/layout/layout.js',
  //'src/data-table/data-table.js',
  // And finally, the ripples
  'assets/src/mdl/ripple/ripple.js'
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
    .pipe($.size({title: 'styles'}));
});


// Concatenate And Minify JavaScript
gulp.task('scripts', () =>
  gulp.src(SOURCES)
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
    .pipe($.size({title: 'scripts'}))
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



gulp.task('default', cb => {
  runSequence(
    'styles',
    ['scripts'],
    cb);
});

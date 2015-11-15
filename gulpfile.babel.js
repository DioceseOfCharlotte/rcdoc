/**
 * MEH gulp
 */

//'use strict';

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
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

const SOURCESJS = [
  // ** MDL ** //
  // Component handler
  'assets/src/mdl/mdlComponentHandler.js',
  // Polyfills/dependencies
  'assets/src/mdl/third_party/**/*.js',
  // Base components
  'assets/src/mdl/button/button.js',
  //'src/checkbox/checkbox.js',
  //'assets/src/mdl/icon-toggle/icon-toggle.js',
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
  'assets/src/mdl/ripple/ripple.js',
  // ** GSAP ** //
  'assets/src/js/TweenMax.min.js',
  'assets/src/js/MorphSVGPlugin.min.js',
  'assets/src/js/DrawSVGPlugin.min.js',
  // ** ScrollMagic ** //
  'assets/src/js/ScrollMagic.min.js',
  'assets/src/js/animation.gsap.min.js',
  // ** Flickity ** //
  'assets/src/js/flickity.pkgd.min.js',
  // ** Mine ** //
  'assets/src/js/myjs/main.js',
];

// Scripts that rely on jQuery
const SOURCESJQ = [
  'assets/src/js/myjs/jq-main.js',
];

// ***** Development tasks ****** //
// Lint JavaScript
gulp.task('lint', () =>
  gulp.src('assets/src/js/myjs/*.js')
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// ***** Production build tasks ****** //
// Optimize images
gulp.task('images', () =>
  gulp.src('assets/src/**/*.{svg,png,jpg}')
  .pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('assets/images'))
  .pipe($.size({
    title: 'images'
  }))
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
    .pipe($.size({
      title: 'styles'
    }));
});

// Concatenate And Minify JavaScript
gulp.task('scripts', () =>
  gulp.src(SOURCESJS)
  .pipe($.sourcemaps.init())
  .pipe($.babel())
  .pipe($.sourcemaps.write())
  // Concatenate Scripts
  .pipe($.concat('main.js'))
  .pipe(gulp.dest('assets/js'))
  // Minify Scripts
  .pipe($.uglify({
    sourceRoot: '.',
    sourceMapIncludeSources: true
  }))
  .pipe($.concat('main.min.js'))
  // Write Source Maps
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('assets/js'))
  .pipe($.size({
    title: 'scripts'
  }))
);

// Concatenate And Minify JavaScript
gulp.task('jq_scripts', () =>
  gulp.src(SOURCESJQ)
  .pipe($.sourcemaps.init())
  //.pipe($.babel())
  .pipe($.sourcemaps.write())
  // Concatenate Scripts
  .pipe($.concat('jq-main.js'))
  .pipe(gulp.dest('assets/js'))
  // Minify Scripts
  .pipe($.uglify({
    sourceRoot: '.',
    sourceMapIncludeSources: true
  }))
  .pipe($.concat('jq-main.min.js'))
  // Write Source Maps
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('assets/js'))
  .pipe($.size({
    title: 'jq_scripts'
  }))
);

/**
 * Defines the list of resources to watch for changes.
 */
// Build and serve the output
gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync.init({
    //proxy: "local.wordpress.dev"
    //proxy: "local.wordpress-trunk.dev"
    proxy: "doc.dev"
      //proxy: "127.0.0.1:8080/wordpress/"
  });

  gulp.watch(['*/**/*.php'], reload);
  gulp.watch(['src/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['src/**/*.js'], ['lint', 'scripts']);
  gulp.watch(['assets/src/images/**/*'], reload);
});

// Build production files, the default task
gulp.task('default', cb => {
  runSequence(
    'styles', [/*'lint',*/ 'scripts', 'jq_scripts', 'images'],
    cb);
});

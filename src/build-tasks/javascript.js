const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

const SOURCESJS = ['src/scripts/main.babel.js'];

const javascript = () => {
	return gulp
		.src(SOURCESJS)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/preset-env']
			})
		)
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(`${global.__buildConfig.dest}/js`));
};

module.exports = {
	task: javascript
};

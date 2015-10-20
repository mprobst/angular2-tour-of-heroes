var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('merge2');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var typescript = require('typescript');

var TSC_OPTIONS = {
  target: 'ES5',
  module: 'commonjs',
  noEmitOnError: true,
  // Specify the TypeScript version we're using.
  typescript: typescript,
  definitions: false,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
};
var tsProject = ts.createProject(TSC_OPTIONS);

var hasError;
var failOnError = true;

var onError = function(err) {
  hasError = true;
  gutil.log(err.message);
  if (failOnError) {
    process.exit(1);
  }
};

gulp.task('compile', function() {
  hasError = false;
  var tsResult = gulp.src(['src/**/*.ts'])
                     .pipe(sourcemaps.init())
                     .pipe(ts(tsProject))
                     .on('error', onError);
  return merge([
    // Write external sourcemap next to the js file
    tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('build/src')),
    tsResult.js.pipe(gulp.dest('build/src')),
  ]);
});

gulp.task('watch', [], function() {
  failOnError = false;
  // Avoid watching generated .d.ts in the build (aka output) directory.
  return gulp.watch(['src/**/*.ts'], {ignoreInitial: true}, ['compile']);
});

gulp.task('default', ['compile']);

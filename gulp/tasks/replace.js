/*!
 * Replace Task
 **/

var gulp = require('gulp');
var replace = require('gulp-replace');


/*! Replace ocurrency in all .html files ***/

gulp.task('replace', function() {

  var searchTerm = '/dist/angular-price-format.js'
  var replaceTerm = '/js/angular-price-format.js';

  return gulp.src('./**/*.html')
    .pipe(replace(searchTerm, replaceTerm))
    .pipe(gulp.dest('./'));

});
/*!
 * Styles Task
 **/

var config       = require('../config').styles;
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var bs           = require('browser-sync').get('VR');
var env          = require('gulp-environment');


/*! Process all .scss files ***/

gulp.task('styles', function () {

  return gulp.src(config.scss.src)
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(env.if.not.development(
      autoprefixer(config.scss.autoprefixer)
    ))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.css.dest))
    .pipe(env.if.not.production(
      bs.stream()
    ));

});
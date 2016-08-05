/*!
 * Server Task
 **/

var config = require('../config').server;
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');


/*! Start node server ***/

gulp.task('server', function (cb) {

  var started = false;

  return nodemon(config)
    .on('start', function () {
      // to avoid nodemon being started multiple times
      if (!started) {
        cb();
        started = true;
      }
    })
    .on('restart', function () {
      console.log('restarted!');
    });

});
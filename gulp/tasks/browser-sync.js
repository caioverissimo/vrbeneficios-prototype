/*!
 * BrowserSync Task
 **/

var config = require('../config').browserSync;
var gulp   = require('gulp');
var bs     = require('browser-sync').create('VR');

gulp.task('browser-sync', ['server'], function() {

  // Init BS server
  bs.init(config);

});
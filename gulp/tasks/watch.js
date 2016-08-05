/*!
 * Watch Task
 **/

var config = require('../config').watch;
var gulp   = require('gulp');
var watch  = require('gulp-watch');
var batch  = require('gulp-batch');
var bs     = require('browser-sync').get('VR');

gulp.task('watch', ['browser-sync'], function() {

  // Watch html, js and images
  watch([
    config.html,
    config.js,
    config.img
  ], function () {
    bs.reload();
  });

  // Watch .scss files and run styles task
  watch(config.scss, function() {
    gulp.start('styles');
  });

  // Watch home images and run sprites-home task
  watch(config.sprites.home, function() {
    gulp.start('sprites-home');
  });

  // Watch painel images and run sprites-painel task
  watch(config.sprites.painel, function() {
    gulp.start('sprites-painel');
  });

  // Watch generated sprites to reload bs
  watch(config.sprites.generated, function(events) {
    if (events.event === 'add')
      bs.reload();
  });

});
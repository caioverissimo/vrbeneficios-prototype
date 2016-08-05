/*!
 * Sprites Task
 **/

var config      = require('../config').sprites;
var gulp        = require('gulp');
var spritesmith = require('gulp.spritesmith');
var buffer      = require('vinyl-buffer');
var merge       = require('merge-stream');
var del         = require('del');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var bs          = require('browser-sync').get('VR');


/*! Generate sprites for home ***/

gulp.task('sprites-home', ['sprites-remove'], function() {
  return generateSprites(config.home);
});


/*! Generate sprites for painel ***/

gulp.task('sprites-painel', ['sprites-remove'], function() {
  return generateSprites(config.painel);
});


/*! Remove old generated sprites ***/

gulp.task('sprites-remove', function() {
  return del([
    config.home.img.dest + config.home.img.name,
    config.painel.img.dest + config.painel.img.name
  ]);
});


/*! Sprites function ***/

function generateSprites(config) {

  // Remove old sprites
  del(config.img.dest + config.img.name);

  var spriteData = gulp.src(config.src)
    .pipe(spritesmith({
      imgName: config.img.name,
      cssName: config.css.name,
      algorithm: 'top-down'
    }));

  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.img.dest));

  var cssStream = spriteData.css
    .pipe(gulp.dest(config.css.dest));

  return merge(imgStream, cssStream);

}
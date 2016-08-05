/*!
 * Build Task
 **/

var config       = require('../config').build;
var gulp         = require('gulp');
var del          = require('del');
var usemin       = require('gulp-usemin');
var preprocess   = require('gulp-preprocess');
var gulpSequence = require('gulp-sequence');
var cssmin       = require('gulp-cssmin');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');


/*! Copy files to build ***/

gulp.task('build-html', function() {
  return gulp.src(config.html.src, { base: '.' })
    .pipe(preprocess({
      context: {
        DEVELOPMENT: false
      }
    }))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('build-app', function() {
  return gulp.src(config.app.src)
    .pipe(gulp.dest(config.app.dest));
});

gulp.task('build-fonts', function() {
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('build-img', function() {
  return gulp.src(config.img.src)
    .pipe(gulp.dest(config.img.dest));
});

gulp.task('build-imgSprites', function() {
  return gulp.src(config.imgSprites.src)
    .pipe(gulp.dest(config.imgSprites.dest));
});



/*! Apply usemin on all .html files ***/

gulp.task('build-usemin', function() {
  return gulp.src(config.usemin.src)
    .pipe(usemin({
      outputRelativePath: '.'
    }))
    .pipe(gulp.dest(config.usemin.dest));
});


/*! Compress files for production ***/

gulp.task('build-compress-js', function() {
  return gulp.src(config.minify.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(config.minify.js.dest));
});

gulp.task('build-compress-css', function() {
  return gulp.src(config.minify.css.src)
    .pipe(cssmin())
    .pipe(gulp.dest(config.minify.css.dest));
});

gulp.task('build-compress-images', function() {
  return gulp.src(config.minify.images.src)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.minify.images.dest));
});


/*! Rename and move folders ***/

gulp.task('build-rename-comum', function() {
  return gulp.src(config.rename.comum.src)
    .pipe(gulp.dest(config.rename.comum.dest));
});

gulp.task('build-rename-css', function() {
  return gulp.src(config.rename.css.src)
    .pipe(gulp.dest(config.rename.css.dest));
});

gulp.task('build-rename-js', function() {
  return gulp.src(config.rename.js.src)
    .pipe(gulp.dest(config.rename.js.dest));
});


/*! Remove old folders after rename ***/

gulp.task('build-clean', function() {
  return del(config.clean.src);
});


/*! Remove old builds ***/

gulp.task('build-remove', function() {
  return del('build');
});


/*! Run tasks in sequence ***/

gulp.task('build',
  gulpSequence(
    ['sprites-home', 'sprites-painel'],
    'build-remove',
    'styles',
    ['build-html', 'build-app', 'build-fonts', 'build-img', 'build-imgSprites'],
    'build-usemin',
    ['build-rename-comum', 'build-rename-css', 'build-rename-js'],
    'build-compress-css',
    'build-compress-js',
    'build-clean'
  )
);
// dependencies
var del = require('del');
var watchify = require('watchify');

// gulp dependencies
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');

// location maps
var copyLocations = [
  {
    src: './src/assets/**/*.*',
    dest: './public/assets'
  },
  {
    src: './src/index.html',
    dest: './public'
  },
  {
    src: './src/vendor/**/*.*',
    dest: './public/vendor'
  }
];

var watchLocations = {
  sass: './src/sass/**/*.scss',
  js: './src/js/**/*.js'
};

var destLocations = {
  sass: './public/css'
};

/* ERROR HANDLER */
var onError = function(err) {
  gutil.log(gutil.colors.red('ERROR', err.plugin), err.message);
  gutil.beep();
  new gutil.PluginError(err.plugin, err, {showStack: true});
};

/* CLEAN */
gulp.task('clean', function(cb) {
  return del(['public/**/*'], cb);
});

/* COPY */
gulp.task('copy', function(cb) {
  var task;
  for (var i = 0; i < copyLocations.length; i++) {
    task = gulp.src(copyLocations[i].src)
    .pipe(plumber())
    .pipe(watch(copyLocations[i].src))
    .pipe(gulp.dest(copyLocations[i].dest))
    .pipe(connect.reload());
  }
  cb();
});

/* SASS */
gulp.task('sass', function() {
  gulp.src('src/sass/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gulp.dest('./public/css'))
      .pipe(connect.reload());
});

gulp.task('sass:watch', function() {
  watch(watchLocations.sass, function() {
    gulp.start('sass');
  });
});

gulp.task('scripts', function() {
  gulp.src('./src/js/**/*.*')
      .pipe(concat('stack.js'))
      .pipe(gulp.dest('./public/js'))
      .pipe(connect.reload());
});

gulp.task('scripts:watch', function() {
  watch(watchLocations.js, function() {
    gulp.start('scripts');
  });
});

/* SERVER */
gulp.task('server', function() {
  connect.server({
    root: 'public',
    port: 5000,
    livereload: true
  });
});

/* MAIN TASKS */
gulp.task('dev', ['clean'], function() {
  gulp.start('copy');
  gulp.start('sass');
  gulp.start('sass:watch');
  gulp.start('scripts');
  gulp.start('scripts:watch');
  gulp.start('server');
});

'use strict';
/*jslint node: true */

var connect = require('connect');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-minify-html');
var httpProxy = require('express-http-proxy');
var inlinemin = require('gulp-minify-inline');
var merge = require('merge-stream');
var run = require('run-sequence');
var serveStatic = require('serve-static');
var vulcanize = require('gulp-vulcanize');

var SRC = 'src/';
var TEST = 'test/';

var BUILD = 'build/';
var DIST = 'dist/';

var api_env = {};

/** BUILD **/

gulp.task('clean', function() {
  return del([BUILD + '**', DIST+ '**']);
});

gulp.task('build', function() {
  var src = gulp.src([SRC + '+(components|css|js)/**/*.+(html|js|json|css)', '!' + SRC +'**/example.html'])
    .pipe(gulp.dest(BUILD));

  var test = gulp.src([TEST + '**/*.+(html|js)'])
    .pipe(gulp.dest(BUILD + 'test'));

  var ico = gulp.src([SRC + 'img/favicon.ico'])
    .pipe(gulp.dest(BUILD));

  var views = gulp.src([SRC + 'views/**/*.html', '!' + SRC +'**/example.html'])
    .pipe(gulp.dest(BUILD));

  var comps = gulp.src(SRC + 'election-dashboard.html')
    .pipe(gulp.dest(BUILD));

  return merge(src, test, ico, views, comps);
});

gulp.task('dist', function() {
  var src = gulp.src([SRC + '+(css|js)/**/*.+(js|css)'])
    .pipe(gulp.dest(DIST));

  var img = gulp.src([SRC + 'img/*.*', '!' + SRC +'**/favicon.ico'])
    .pipe(gulp.dest(DIST + 'img/'));

  var ico = gulp.src([SRC + 'img/favicon.ico'])
    .pipe(gulp.dest(DIST));

  var bower = gulp.src(['bower_components/**/*.*'])
    .pipe(gulp.dest(DIST + 'bower_components/'));

  var views = gulp.src([SRC + 'views/**/*.html', '!' + SRC +'views/**/example.html'])
    .pipe(gulp.dest(DIST));

  var comps = gulp.src(SRC + 'election-dashboard.html')
    .pipe(vulcanize({
      abspath: '',
      inlineScripts:true,
      inlineCss:true
    }))
    .pipe(htmlmin({
      quotes: true,
      empty: true,
      spare: true
    }))
    .pipe(inlinemin())
    .pipe(gulp.dest(DIST));

  return merge(src, img, ico, bower, views, comps);
});

gulp.task('default', function(cb) {
  run('clean','build', cb);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.html', 'src/**/*.js', 'src/**/*.json', 'src/**/*.css', 'src/**/ *.ico', 'test/**/*.html',
    'test/**/*.js'], ['build']);
});

gulp.task('server', function() {
  api_env = require('./' + BUILD + 'js/config.json');
  connect()
    .use('/bower_components', serveStatic('./bower_components'))
    .use(serveStatic(BUILD))
    .listen(8000);
});

gulp.task('server:dist', function() {
  connect()
    .use(serveStatic(DIST))
    .listen(8000);
});

function response_status (statusCode) {
  /*jshint validthis: true */
  this.statusCode = statusCode;
}

function forwardPath (req, res) {
  // monkey-patch server-response object for proxy plugin
  res.send = res.end;
  res.status = response_status;
  res.set = res.setHeader;
  return req.originalUrl;
}

gulp.task('live', ['server','watch']);
gulp.task('prod', ['server:dist']);

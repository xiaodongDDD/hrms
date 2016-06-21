/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');

// Include Plugins
var del = require('del');
var gulpif = require('gulp-if');
var gulpIgnore = require('gulp-ignore');
var jshint = require('gulp-jshint');
var useref = require('gulp-useref');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nano = require('gulp-cssnano');
var runSequence = require('gulp-run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var notify = require('gulp-notify');//提示信息
var gulpNgConfig = require('gulp-ng-config');//提示信息
 
var jsFilePath = ['app/scripts/*.js','app/scripts/*/*.js','app/app.js','app/pages/**/*.js','app/pages/**/**/*.js','app/pages/**/**/**/*.js'];
var htmlFilePath = ['app/pages/**/*.html','app/pages/**/**/*.html','app/pages/**/**/**/*.html','app/pages/**/**/**/**/*.html'];
var libFilePath = ['app/lib/**/*.*','app/lib/**/**/*.*','app/lib/**/**/**/*.*'];
var imgFilePath = ['app/img/**/*.png','app/img/**/**/*.png','app/img/**/**/**/*.png'];


// Clean Task
gulp.task('clean', function () {
  return gulp.src(['www/build/*','www/lib/*','app/scripts/baseConfig.js']).pipe(clean());
});

gulp.task('clean-code', function () {
  return gulp.src(['www/build/css/**/*.css','www/build/pages/*','www/build/img/*','www/build/app.bundle.js','www/build/app.bundle.min.js']).pipe(clean());
  //del(['www/build/css/*','www/build/pages/*','www/build/img/*','www/build/app.bundle.js','www/build/app.bundle.min.js']);
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src(jsFilePath)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Handle HTML
gulp.task('pagesHtml', function(){
  return gulp.src(htmlFilePath)
    .pipe(useref({noAssets:true}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/build/pages'));
});

gulp.task('rootHtml', function(){
  return gulp.src('src/*.html')
    .pipe(useref({noAssets:true}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www'));
});

gulp.task('html', [/*'rootHtml',*/ 'pagesHtml']);

// Copy JavaScript Lib
gulp.task('copy-libs', function(){
  return gulp.src(libFilePath)
    .pipe(gulp.dest('www/build/lib'));
});

//Copy Image File
gulp.task('copy-img', function() {
  return gulp.src(imgFilePath)
    .pipe(gulp.dest('www/build/img'));
});

gulp.task('copy-lib', ['copy-libs','copy-img']);


// Compile Sass
gulp.task('sass', function() {
    return gulp.src(['app/theme/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('www/build/css'));
});

gulp.task('config-dev', function () {
  gulp.src('app/config/devConfig.json')
    .pipe(gulpNgConfig('baseConfig'))
    .pipe(rename("baseConfig.js"))
    .pipe(gulp.dest('app/scripts'))
});

// Minify CSS
gulp.task('css', function () {
    return gulp.src('src/css/**/*.css')
            .pipe(sourcemaps.init())
            .pipe(gulp.dest('www/css'))  // write source file for debug
            .pipe(nano({reduceIdents: false}))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '.'}))
            .pipe(gulp.dest('www/css'));
});

// Concat And Uglify JS
gulp.task('scripts', function () {
    return gulp.src(jsFilePath)
            //.pipe(sourcemaps.init())
            .pipe(concat('app.bundle.js'))
            .pipe(gulp.dest('www/build')); // write source file for debug
            /*.pipe(uglify({mangle: true}))  // for debug, do not mangle variable name
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '.'}))
            .pipe(gulp.dest('www/build'));*/
            //.pipe(notify({ message: 'scripts task ok' }));
});

// copy all files
gulp.task('copy-dev', function () {
  return gulp.src([
      'src/**/*',
      '!src/index.html',
      '!src/scripts/*'])
    .pipe(gulp.dest('www'));
});

// copy product env files, ignore source and useless files
gulp.task('copy-prod', function () {
    return gulp.src([
        'src/**/*',
        '!src/index.html',
        '!src/**/*.ts',
        '!src/**/*.less',
        '!src/**/*.sass',
        '!src/**/*.styl',
        '!src/css/*',
        '!src/**/*.md',
        '!src/scripts/*'])
            .pipe(gulp.dest('www'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(['app/**/*'], ["rebuild-dev"]);
    console.log("----have file change -----");
});

gulp.task('rebuild-dev', function (callback) {
  runSequence('clean-code', ['copy-img','sass' , 'scripts', 'html'], callback);
});

gulp.task('build-dev', function (callback) {
runSequence('config-dev', ['lint','copy-lib' ,'sass' , 'scripts', 'html'], callback);
});

gulp.task('build-prod', function (callback) {
  runSequence('copy-prod', ['lint', 'copy-lib','sass', 'scripts', 'html'], callback);
});

// Default Task
gulp.task('default', ['run-dev']);

// Default Task
gulp.task('run-dev', function (callback) {
    runSequence('clean', 'build-dev', callback);
});

// Default Task
gulp.task('run-prod', function (callback) {
    runSequence('clean', 'build-prod', callback);
});

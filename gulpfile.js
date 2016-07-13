/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');

//Include Plugins
var del = require('del');
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

var jsFilePath = [
  'app/scripts/*.js',
  'app/scripts/*/*.js',
  'app/app.js',
  'app/pages/**/*.js',
  'app/pages/**/**/*.js',
  'app/pages/**/**/**/*.js'];

var htmlFilePath = [
  'app/pages/**/*.html',
  'app/pages/**/**/*.html',
  'app/pages/**/**/**/*.html',
  'app/pages/**/**/**/**/*.html'];

var libDevFilePath = [
  'app/lib/**/*.*',
  'app/lib/**/**/*.*',
  'app/lib/**/**/**/*.*'];

var libPublishFilePath = [
  'app/lib/**/css/ionic.css',
  'app/lib/**/fonts/*.*',
  'app/lib/**/js/ionic.bundle.js',
  'app/lib/**/rollups/md5.js',
  'app/lib/**/dist/jquery.min.js',
  'app/lib/**/dist/ng-cordova.js'];

var imgFilePath = [
  'app/img/**/*.png',
  'app/img/**/**/*.*',
  'app/img/**/**/**/*.png',
  'app/img/*.gif'];

var configDEVPath = [
  'publish/TEST/config.xml'];

var configPRODPath = [
  'publish/PROD/config.xml'];

var pluginDEVPath = [
  'publish/TEST/plugins/*.*',
  'publish/TEST/plugins/**/*.*',
  'publish/TEST/plugins/**/**/*.*',
  'publish/TEST/plugins/**/**/**/*.*',
  'publish/TEST/plugins/**/**/**/**/*.*',
  'publish/TEST/plugins/**/**/**/**/**/*.*'];
var pluginPRODPath = [
  'publish/PROD/plugins/*.*',
  'publish/PROD/plugins/**/*.*',
  'publish/PROD/plugins/**/**/*.*',
  'publish/PROD/plugins/**/**/**/*.*',
  'publish/PROD/plugins/**/**/**/**/*.*',
  'publish/PROD/plugins/**/**/**/**/**/*.*'];

//清除自动生成的目录文件
gulp.task('clean', function () {
  return gulp.src(['www/build/*','app/scripts/baseConfig.js', 'config.xml'
    /*,'plugins/com.handmobile.cordovaplugin.hotpatch/*', 'plugins/hand-im-plugin-device/*'*/]).pipe(clean());
});

gulp.task('clean-code', function () {
  return gulp.src(['www/build/css/*','www/build/img/*','www/build/pages/*','www/build/app.bundle.js']).pipe(clean());
});

gulp.task('clean-bundle-js', function () {
  return gulp.src(['www/build/app.bundle.js']).pipe(clean());
});

//语法检查
gulp.task('lint', function () {
  return gulp.src(jsFilePath)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//复制页面到运行目录
gulp.task('pagesHtml', function () {
  return gulp.src(htmlFilePath)
    .pipe(useref({noAssets: true}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/build/pages'));
});

//
gulp.task('rootHtml', function () {
  return gulp.src('src/*.html')
    .pipe(useref({noAssets: true}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www'));
});

//新建复制页面任务
gulp.task('html', [/*'rootHtml',*/ 'pagesHtml']);

//复制开发环境的依赖库文件
gulp.task('copy-dev-libs', function () {
  return gulp.src(libDevFilePath)
    .pipe(useref({noAssets: true}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/build/lib'));
});

//复制发布环境的依赖库文件
gulp.task('copy-publish-libs', function () {
  return gulp.src(libPublishFilePath)
    .pipe(gulp.dest('www/build/lib'));
});

//复制图片文件
gulp.task('copy-img', function () {
  return gulp.src(imgFilePath)
    .pipe(gulp.dest('www/build/img'));
});

//复制开发环境 config.xml
gulp.task('copy-dev-config', function () {
  return gulp.src(configDEVPath)
    .pipe(gulp.dest(''));
});

//复制发布环境 config.xml
gulp.task('copy-prod-config', function () {
  return gulp.src(configPRODPath)
    .pipe(gulp.dest(''));
});

/*
 gulp.task('copy-dev-plugin', function () {
 return gulp.src(pluginDEVPath)
 .pipe(gulp.dest('plugins'));
 });
 gulp.task('copy-prod-plugin', function () {
 return gulp.src(pluginPRODPath)
 .pipe(gulp.dest('plugins'));
 });
 */
//定义开发环境的依赖库文件任务
gulp.task('copy-dev-lib', function (callback) {
  runSequence('copy-dev-libs', 'copy-img', callback);
});

//定义发布环境的依赖库文件任务
gulp.task('copy-publish-lib', function (callback) {
  runSequence('copy-publish-libs', 'copy-img', callback);
});

//合并压缩css文件
gulp.task('sass', function () {
  return gulp.src(['app/theme/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('www/build/css'));
});


//生成开发环境环境配置文件
gulp.task('config-dev', function () {
  gulp.src('app/config/devConfig.json')
    .pipe(gulpNgConfig('baseConfig'))
    .pipe(rename("baseConfig.js"))
    .pipe(gulp.dest('app/scripts'))
});

//生成发布环境环境配置文件
gulp.task('config-prod', function () {
  gulp.src('app/config/prodConfig.json')
    .pipe(gulpNgConfig('baseConfig'))
    .pipe(rename("baseConfig.js"))
    .pipe(gulp.dest('app/scripts'))
});

//压缩css
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

//合并压缩丑化Js
gulp.task('scripts', function () {
  return gulp.src(jsFilePath)
    .pipe(concat('app.bundle.js'))
    .pipe(gulp.dest('www/build'));// write source file for debug
    //.pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    //.pipe(uglify())    //压缩
    //.pipe(gulp.dest('www/build'));  //输出
});

//
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

//自动观察代码变化
gulp.task('watch', function () {
  gulp.watch(['app/**/*'], ["rebuild-dev"]);
  console.log("----have file change -----");
});

//手动更新www/build代码
gulp.task('rebuild', function (callback) {
  runSequence('clean-code', ['copy-img', 'sass', 'scripts', 'html'], callback);
});

//生成开发环境代码目录
gulp.task('run-dev', function (callback) {
  runSequence('clean', 'config-dev', /*'lint',*/ 'copy-dev-config', 'copy-publish-libs', ['sass', 'scripts', 'html'], callback);
});

//生成发布环境代码目录
gulp.task('run-prod', function (callback) {
  runSequence('clean', 'config-prod', /*'lint',*/ 'copy-prod-config', 'copy-publish-lib', ['sass', 'scripts', 'html'], callback);
});

//默认任务
gulp.task('default', ['run-dev']);

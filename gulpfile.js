'use strict';

const gulp     = require('gulp');
const util     = require('gulp-util');
const sass 	   = require('gulp-sass');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const minify   = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const htmlmin  = require('gulp-htmlmin');


//- Kompilacja SASSÓW (Bootstrap + site components)
var sassFiles = 'app/sass/**/*.scss',
	paths = {
		assets: {
			js: 'app/assets/javascript/',
			database: 'database/',
			app: 'app/',
			ctrl: 'app/controllers/'
		}
	}


gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/assets/css'));
});

gulp.task('watch', ['sass'], function() {
    gulp.watch(sassFiles,['sass']);
});

/* Task do kopiowania Sassów */
gulp.task('copy-sass', function() {
	return gulp.src('app/assets/css/site-components.css')
		.pipe(cleanCSS({compatibility: 'ie11'}))
		.pipe(gulp.dest('target/' + util.env.projectName + '/assets/css'))
});

gulp.task('copy-img', function() {
	return gulp.src('app/assets/images/**')
		.pipe(gulp.dest('target/' + util.env.projectName + '/assets/images'))
});

gulp.task('copy-templates', function() {
	return gulp.src('app/templates/**')
		.pipe(gulp.dest('target/' + util.env.projectName + '/templates'))
});

gulp.task('copy-includes', function() {
	return gulp.src('app/includes/**')
		.pipe(gulp.dest('target/' + util.env.projectName + '/includes'))
});

gulp.task('copy-index', function() {
	return gulp.src('index.core.html')
		.pipe(plumber())
		.pipe(concat('index.html'))
		// .pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('target/' + util.env.projectName))
});

gulp.task('build', ['copy-sass', 'copy-img', 'copy-templates', 'copy-includes', 'copy-index'], function () {
	return gulp.src([
		paths.assets.js + 'jquery-2.2.4.min.js',
		paths.assets.js + 'bootstrap.min.js',
		paths.assets.js + 'angular1.5.3.min.js',
		paths.assets.js + 'angular-route.min.js',
		paths.assets.js + 'angular-animate.min.js',
		paths.assets.js + 'firebase.js',
		paths.assets.database  + util.env.projectName + '/**',
		paths.assets.js + 'angularfire.min.js',
		paths.assets.js + 'pdfmake.min.js',
		paths.assets.js + 'vfs-fonts.min.js',
		paths.assets.js + 'angular-notifications.js',
		paths.assets.js + 'angular-accordions.min.js',
		paths.assets.app + 'app.module.js',
		paths.assets.app   + 'app.routes.js',
		paths.assets.ctrl  + 'ctrl.add.new.guest.js',
		paths.assets.ctrl  + 'ctrl-page-header.js',
		paths.assets.ctrl  + 'controller-app-version.js'
	])
	.pipe(plumber())
	.pipe(concat('bundle.js'))
	.pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        }
    }))
	.pipe(gulp.dest('target/' + util.env.projectName + '/assets/javascript'))
});

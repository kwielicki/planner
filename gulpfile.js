'use strict';

const gulp     = require('gulp');
const util     = require('gulp-util');
const sass 	   = require('gulp-sass');
const plumber  = require('gulp-plumber');
const concat   = require('gulp-concat');
const minify   = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const htmlmin  = require('gulp-htmlmin');
const babel    = require('gulp-babel');
const browserSync = require('browser-sync');

const fs = require('fs');

const jsonScriptConfig = JSON.parse(fs.readFileSync('app/assets/javascript/package.json'));

//- Kompilacja SASSÓW (Bootstrap + site components)
const sassFiles = 'app/sass/**/*.scss',
	paths = {
		assets: {
			js: 'app/assets/javascript/',
			i18n: 'app/assets/i18n/',
			database: 'database/',
			app: 'app/',
			ctrl: 'app/controllers/',
			module: 'app/modules/',
			directive: 'app/directive/',
			components: 'app/components/',
			filters: 'app/filters/'
		}
	};

const bundleScriptIterator = jsonScriptConfig.map(function(singleScript) {
	return paths.assets.js + singleScript;
});
bundleScriptIterator.push(paths.assets.i18n + 'polish/angular-locale_pl-pl.js');

gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/assets/css'))
	.pipe(browserSync.stream({once: true}));
});

gulp.task('watch', ['sass'], function() {
	browserSync({
			proxy: "http://127.0.0.1:8080",
			online: true,
			tunnel: true,
			loglevel: "debug"
		}, function(err, bs) {
    	console.log(err);
	});
    gulp.watch(sassFiles,['sass']);
});

/* Task do kopiowania Sassów */
gulp.task('copy-sass', function() {
	return gulp.src('app/assets/css/site-components.css')
		.pipe(cleanCSS({compatibility: 'ie11'}))
		.pipe(gulp.dest('target/' + util.env.projectName + '/assets/css'))
});

gulp.task('copy-img', function() {
	return gulp.src(['app/assets/images/**', 'app/assets/fonts'])
		.pipe(gulp.dest('target/' + util.env.projectName + '/assets/images'))
});

gulp.task('copy-fonts', function() {
	return gulp.src('app/assets/fonts/**')
		.pipe(gulp.dest('target/' + util.env.projectName + '/assets/fonts'))
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

// Application Core Build
gulp.task('core-bundle', function() {
	return gulp.src(bundleScriptIterator)
	.pipe(plumber())
	.pipe(concat('core-bundle.js'))
	.pipe(minify({
        ext:{
            min:'.min.js'
        },
		noSource: true,
		mangle: true
    }))
	.pipe(gulp.dest('target/' + util.env.projectName + '/assets/javascript'))
});

// Firebase WEB SDK
gulp.task('firebase-sdk', function() {
	return gulp.src([
		paths.assets.database  + util.env.projectName + '/**'
	])
	.pipe(concat('firebase-sdk.js'))
	.pipe(minify({
        ext:{
            min:'.min.js'
        },
		noSource: true,
		mangle: false
    }))
	.pipe(gulp.dest('target/' + util.env.projectName + '/assets/javascript'))
});

gulp.task('build', ['copy-sass', 'copy-img', 'copy-fonts', 'copy-templates', 'copy-includes', 'copy-index', 'core-bundle', 'firebase-sdk'], function () {
	return gulp.src([
		paths.assets.module + 'module-wedding-planner.js',
		paths.assets.module + 'module-planner-snackbar.js',
		paths.assets.module + 'module-angular-sticky.js',
		paths.assets.app + 'app.module.js',
		paths.assets.app   + 'app.routes.js',
		paths.assets.ctrl  + 'ctrl.add.new.guest.js',
		paths.assets.ctrl  + 'ctrl-page-header.js',
		paths.assets.ctrl  + 'controller-app-version.js',
		paths.assets.ctrl  + 'ctrl-delete-person.js',
		paths.assets.ctrl  + 'controller-user-login.js',
		paths.assets.ctrl  + 'controller-user-logout.js',
		paths.assets.ctrl  + 'controller-main-firebase.js',
		paths.assets.ctrl  + 'controller-wedding-notebook-list.js',
		paths.assets.ctrl  + 'controller-popover.js',
		paths.assets.directive  + 'directive-for-anchor.js',
		paths.assets.directive  + 'directive-for-table-preloader.js',
		paths.assets.directive  + 'directive-for-fade-in.js',
		paths.assets.directive  + 'directive-display-mode-detection.js',
		paths.assets.directive  + 'directive-contenteditable.js',
		paths.assets.directive  + 'directive-focus-element-triggerer.js',
		paths.assets.components + 'app-card-component.js',
		paths.assets.components + 'app-wedding-notebook-filter-component.js',
		paths.assets.components + 'app-footer-component.js',
		paths.assets.components + 'app-user-profile-component.js',
		paths.assets.components + 'app-spinner-component.js',
		paths.assets.components + 'app-image-box-component.js',
		paths.assets.components + 'app-image-box-element-component.js',
		paths.assets.components + 'app-intro-banner.js',
		paths.assets.components + 'app-manageguest-sorting-label.js',
		paths.assets.components + 'app-information-box.js',
		paths.assets.components + 'app-breadcrumbs.js',
		paths.assets.components + 'app-todo-list.js',
		paths.assets.components + 'comp-cookies.js',
		paths.assets.components + 'comp-news.js',
		paths.assets.components + 'comp-news-article.js',
		paths.assets.components + 'comp-planner.js',
		paths.assets.components + 'comp-header.js',
		paths.assets.components + 'comp-statistic.js',
		paths.assets.components + 'comp-edit-guest.js',
		paths.assets.filters + 'app-percentage-filter.js',
		paths.assets.filters + 'app-characters-in-circle.js',
		paths.assets.filters + 'app-object-length.js',
		paths.assets.filters + 'app-object-summ.js',
		paths.assets.filters + 'app-guest-statistics-filter.js'
	])
	.pipe(babel({
        presets: ['es2015']
    }))
	.pipe(plumber())
	.pipe(concat('application-bundle.js'))
	.pipe(minify({
        ext:{
            min:'.min.js'
        },
		noSource: true,
		mangle: false
    }))
	.pipe(gulp.dest('target/' + util.env.projectName + '/assets/javascript'))
});

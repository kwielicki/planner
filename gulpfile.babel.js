'use strict';

/*
 * Gulp modul imports
 */
import {gulp, src, dest, watch, parallel, series} from 'gulp';
import util from 'gulp-util';
import del from 'del';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import minify from 'gulp-minify';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';

const fs = require('fs'),
	  jsonScriptConfig = JSON.parse(fs.readFileSync('app/assets/javascript/package.json')),
	  sassFiles = 'app/sass/**/*.scss',
	  paths = {
		assets: {
			js: 'app/assets/javascript/',
			i18n: 'app/assets/i18n/',
			database: 'database/',
			app: 'app/',
			controllers: 'app/controllers/',
			modules: 'app/modules/',
			directives: 'app/directive/',
			components: 'app/components/',
			filters: 'app/filters/'
		}
	};

const {
	modules,
	app,
	directives,
	filters,
	controllers,
	components
} = paths.assets;

const bundleScriptIterator = jsonScriptConfig.map(function(singleScript) {
	return paths.assets.js + singleScript;
});
bundleScriptIterator.push(paths.assets.i18n + 'polish/angular-locale_pl-pl.js');


/* Task information:
 *  task name - sassBuilder
 *  task info - for compiling Scss to Css
 */
export const sassBuilder = () => src(sassFiles)
	.pipe(sass())
	.on("error",sass.logError)
	.pipe(dest('app/assets/css'))
	.pipe(browserSync.stream());


/* Task information:
 *  task name - appReloading
 *  task info - for browser reloading
 */
export const appReloading = () => browserSync.reload();


/* Task information:
 *  task name - appWatcher
 *  task info - for browser syncing, scss compiling and watching changes in scss files
 */
export const appWatcher = () => browserSync.init({
	proxy: "http://127.0.0.1:8080",
	online: true,
	tunnel: true,
	browser: "chrome",
	loglevel: "debug"
	}, function(err, bs) {
		console.log(err);
	});
	watch(sassFiles, sassBuilder);
	watch(sassFiles, appReloading);


/* Task information:
 *  task name - buildCopySass
 *  task info - for sass coping (req for build task)
 */
export const buildCopySass = () => src('app/assets/css/site-components.css')
	.pipe(cleanCSS({compatibility: 'ie11'}))
	.pipe(dest('target/' + util.env.projectName + '/assets/css'));


/* Task information:
 *  task name - buildCopyImages
 *  task info - for images coping (req for build task)
 */
export const buildCopyImages = () => src(['app/assets/images/**', 'app/assets/fonts'])
	.pipe(dest('target/' + util.env.projectName + '/assets/images'));


/* Task information:
 *  task name - buildCopyImages
 *  task info - for fonts coping (req for build task)
 */
export const buildCopyFonts = () => src('app/assets/fonts/**')
	.pipe(dest('target/' + util.env.projectName + '/assets/fonts'));


/* Task information:
 *  task name - buildCopyTemplates
 *  task info - for templates coping (req for build task)
 */
export const buildCopyTemplates = () => src('app/templates/**')
	.pipe(dest('target/' + util.env.projectName + '/templates'));


/* Task information:
 *  task name - buildCopyTemplates
 *  task info - for templates coping (req for build task)
 */
export const buildCopyIncludes = () => src('app/includes/**')
	.pipe(dest('target/' + util.env.projectName + '/includes'));


/* Task information:
 *  task name - buildCopyIndex
 *  task info - for index coping (req for build task)
 */
export const buildCopyIndex = () => src('index.core.html')
	.pipe(plumber())
	.pipe(concat('index.html'))
	.pipe(dest('target/' + util.env.projectName));


/* Task information:
 *  task name - coreBundling
 *  task info - for core file preparing and concatinating
 */
export const coreBundling = () => src(bundleScriptIterator)
	.pipe(plumber())
	.pipe(concat('core-bundle.js'))
	.pipe(minify({
		ext:{
			min:'.min.js'
		},
		noSource: true,
		mangle: true
	}))
	.pipe(dest('target/' + util.env.projectName + '/assets/javascript'));


/* Task information:
 *  task name - firebaseSdk
 *  task info - for firebase sdk file preparing and minifing
 */
export const firebaseSdk = () => src(paths.assets.database  + util.env.projectName + '/**')
	.pipe(concat('firebase-sdk.js'))
	.pipe(dest('target/' + util.env.projectName + '/assets/javascript'));

/* Task information:
 *  task name - applicationJsBundle
 *  task info - for application javascript files preparing and minifing
 */
export const applicationJsBundle = () => src([
		`${modules}/**.js`,
		`${app}/**.js`,
		`${directives}/**.js`,
		`${filters}/**.js`,
		`${controllers}/**.js`,
		`${components}/**.js`
	])
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(plumber())
	.pipe(concat('application-bundle.js'))
	.pipe(minify({
		ext: {
			min: '.min.js'
		},
		noSource: true,
		mangle: false
	}))
	.pipe(dest('target/' + util.env.projectName + '/assets/javascript'));


export const clean = () => del(['appBuilder']);
export const appBuilder = series(clean, parallel(
		buildCopySass,
		buildCopyIndex,
		buildCopyImages,
		buildCopyFonts,
		buildCopyTemplates,
		buildCopyIncludes,
		coreBundling,
		firebaseSdk,
		applicationJsBundle
	));

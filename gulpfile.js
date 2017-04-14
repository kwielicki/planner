'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');


//- Kompilacja SASSÓW (Bootstrap + site components)
var sassFiles = 'app/sass/**/*.scss';


gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('watch',function() {  
    gulp.watch(sassFiles,['sass']);
});


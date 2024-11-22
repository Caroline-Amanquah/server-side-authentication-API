const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
 return gulp.src('scss/main.scss')
   .pipe(sourcemaps.init()) 
   .pipe(sass().on('error', sass.logError))
   .pipe(sourcemaps.write('.')) 
   .pipe(gulp.dest('./pages/css')); 
});


gulp.task('watch', function () {
gulp.watch('scss/**/*.scss', gulp.series('sass'));
});

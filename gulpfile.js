const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
 return gulp.src('scss/main.scss')
   .pipe(sourcemaps.init()) // Initialize sourcemaps before compilation starts
   .pipe(sass().on('error', sass.logError))
   .pipe(sourcemaps.write('.')) // Write sourcemaps to the same directory as the CSS files
   .pipe(gulp.dest('./pages/css')); // Ensure CSS files are outputted here
});


gulp.task('watch', function () {
gulp.watch('scss/**/*.scss', gulp.series('sass'));
});

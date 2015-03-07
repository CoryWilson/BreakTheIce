// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');

gulp.task('sass', function() {
	return gulp.src('/public/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('/public/css/'));
});

// Default Task
gulp.task('default',['sass']);

gulp.task('sass',['sass']);

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
gulp.task('js', function () {
    return gulp.src('src/js/*js')
        // .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    gulp.src('dist/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
})

gulp.task('images', function () {
    gulp.src('src/images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('sass', function() {
    return sass('src/sass/*.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('dist/css'))
});
gulp.task('copyvideo', function () {
    gulp.src('src/video/**/*')
        .pipe(gulp.dest('dist/video/'))
});
gulp.task('copyfonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('auto',function(){
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/js/*js', ['js']);
  gulp.watch('dist/css/*.css', ['css']);
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/video/*.*', ['copyvideo']);
  gulp.watch('src/fonts/*.*', ['copyfonts']);
})

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("dist/js/*.js").on('change', browserSync.reload);
    // gulp.watch("dist/css/*.css").on('change', browserSync.reload);
    gulp.watch("dist/images/*.*").on('change', browserSync.reload);
});
gulp.task('default',['serve','auto'])

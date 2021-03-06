const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const maps = require('gulp-sourcemaps');
const sync = require('browser-sync');
const nunjucks = require('gulp-nunjucks-render');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const terser = require('gulp-terser');

gulp.task('css', () => {
  return gulp
    .src('src/main.scss')
    .pipe(plumber()) 
    .pipe(maps.init())
    .pipe(
      sass({
        includePaths: ['./node_modules/normalize-scss/sass/'],
      }),
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    )
    .pipe(csso())
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(maps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream());
});

gulp.task('html', () => {
  return gulp
    .src('src/views/**/*.html')
    .pipe(plumber())
    .pipe(
      nunjucks({
        path: 'src/',
      }),
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/'))
    .pipe(sync.stream());
});

gulp.task('img', () => {
  return gulp
    .src('src/assets/img/**/*.*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(gulp.dest('dist/img'));
});

gulp.task('js', () => {
  return gulp
  .src('index.js')
  .pipe(plumber())
  .pipe(maps.init())
  .pipe(rigger())
  .pipe(terser())
  .pipe(maps.write())
  .pipe(plumber.stop())
  .pipe(gulp.dest('dist/'))
  .pipe(sync.stream());
})

gulp.task('modules', () => {
  sources = [
    './node_modules/chosen-js/chosen.jquery.min.js',
    './node_modules/chosen-js/chosen.min.css'
  ]
  return gulp
  .src(sources)
  .pipe(gulp.dest('dist/modules/'))
  .pipe(sync.stream());
})

gulp.task('copy-modules', ['modules']);

gulp.task('reload', () => {
  sync({
    server: {
      baseDir: 'dist/',
    },
    notify: false,
  });
});

gulp.task('watch', ['img', 'js', 'css', 'html','reload'], () => {
  watch('src/**/*.scss', () => gulp.start('css'));
  watch('src/**/*.html', () => gulp.start('html'));
  watch('src/**/*.js', () => gulp.start('js'));
});

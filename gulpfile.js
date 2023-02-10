const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const postcss = require("gulp-postcss");
const autoprefixer = require('autoprefixer');
const rename = require("gulp-rename");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const mode = require('gulp-mode')();
const uglify = require('gulp-uglify-es').default;


function styles() {
  return src('src/scss/style.scss')
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass())
    .pipe(mode.production(gcmq()))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest('assets/css/'))
    .pipe(browserSync.stream())

}
exports.styles = styles;

function scripts() {
  return src('src/js/main.js')
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('assets/js/'))
    .pipe(browserSync.stream())
}
exports.scripts = scripts;

function serve() {
  let files = [
    'assets/css/style.css',
    'assets/js/style.min.js',
    '**/*.php'
  ];

  browserSync.init(files, {
    proxy: "http://rsmwpstart",
    host: 'rsmwpstart',
    open: 'external'
  });

  watch(["src/scss/**/*.scss"], parallel(styles));
  watch(["src/js/**/*.{js,min.js}"], parallel(scripts));
}

exports.serve = serve;

exports.default = parallel(styles, scripts, serve);

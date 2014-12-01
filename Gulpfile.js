/**
 * Gulpfile
 * Copyright (c) 2014 Crip.io
 */


/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/
var
  gulp = require("gulp"),
  concat = require("gulp-concat"),
  header = require("gulp-header"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  nodemon = require("gulp-nodemon")
  stylus = require("gulp-stylus"),
  uglify = require("gulp-uglify"),
  package = require("./package.json");



// Banner using meta data from package.json
var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.description %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');


// Project paths
var paths = {
  src: {
    css: './public/style/',
    js: './public/js/',
    html: './views/',
  },
  dist: {
    css: './public/dist/',
    js: './public/dist/',
    html: './views/'
  }
};


// Minify and concat css
gulp.task('stylus', function() {
  gulp.src(paths.src.css + 'master.styl')
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(stylus({
      compress: true
    }))
    .pipe(header(banner, {
      package: package
    }))
    .pipe(concat('master.min.css'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(reload({
      stream: true,
    }));
});


// Concatinate and minify Javascript
gulp.task('js', function() {
  gulp.src([
    paths.src.js + 'main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(header(banner, {
      package: package
    }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(reload({
      stream: true,
    }));
});


gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: {
      proxy: "localhost:3333",
      notify: false
    }
  });
});

// Browser sync reload
gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['stylus', 'js', 'browser-sync'], function () {
  gulp.watch([paths.src.css + '*.styl'], ['stylus', 'bs-reload']);
  gulp.watch([paths.src.js + '*.js'], ['js', 'bs-reload']);
  gulp.watch([paths.src.html + '*.jade'], ['bs-reload']);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({script: 'server.js'}).on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  });
});

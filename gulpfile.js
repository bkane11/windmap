'use strict';
// Generated on 2014-10-01 using generator-leaflet 0.0.16

var gulp = require('gulp'),
    open = require('open'),
    debug = require('gulp-debug'),
    rename = require('gulp-rename'),
    path = require('path'),
    wiredep = require('wiredep').stream;

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
gulp.task('styles', function () {
    return gulp.src(['app/styles/main.css'])
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['app/scripts/**/*.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
});

// clear cache to fix imagemin error
gulp.task('clear_cache', function (done) {
    return $.cache.clearAll(done);
});


function imageclean(){
    var src = this[0],
        dest = this.length>1 ? this[1] : '',
        base = this.length>2  ? {base : this[2] } : {};
        base.addRootSlash = true;
    console.log(this, dest, base);
    gulp.src(src , base )
        .pipe( rename(function(dir){
                if(base.base && base.base.indexOf('bower_components')!==-1 && dir.dirname.indexOf('..')!==-1){
                    var bc = dir.dirname.split(path.sep)[1].split(path.sep)[0];
                    console.log(dir, dir.dirname);
                    var style = '';
                    ['style', 'css'].forEach(function(s){
                        if(dir.dirname.indexOf(path.sep + 'style' + path.sep)!==-1)
                            style = 'style';
                    })
                    dir.dirname = path.join(style, dir.dirname.split('images').pop().split('img').pop());
                    console.log(dir, dir.dirname,  base.base, bc);
                }
            })
        )
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        // .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('dist' + dest))
        .pipe($.size());
}

// Images
gulp.task('images', ['clear_cache'],function () {
    console.log('image-min');
    return [
         [ 'app/images/**/*.{png,jpg,gif,ico,svg}', '/images', 'app/images'],
         [ 'app/*.{png,jpg,gif,ico,svg}'],
         [ 'app/styles/images/**/*.{png,jpg,gif,ico,svg}', '/styles/images', 'app/styles/images'],
         [ 'app/bower_components/**/images/*.{png,jpg,gif,ico,svg}', '/images', 'app/bower_components/images'],
         // [ 'app/bower_components/**/{styles,css}/images/*.{png,jpg,gif,ico,svg}', '/styles/images', 'app/bower_components/styles/images']
         ].forEach(function(src){
            $.cache.clearAll(imageclean.bind(src));
        })
});

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['html', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', function(){
    $.connect.server({
        root: 'app',
        port: 9000,
        livereload: true
    });
});

// Open
gulp.task('serve', ['connect'], function() {
  open("http://localhost:9000");
});

// Inject Bower components
gulp.task('wiredep', function () {
    gulp.src('app/styles/*.css')
        .pipe(wiredep({
            directory: 'app/bower_components',
            ignorePath: 'app/bower_components/'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            ignorePath: 'app/'
        }))
        .pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function (event) {
    	console.log('reload');
        return gulp.src(event.path)
            .pipe($.connect.reload());
    });

    // Watch .css files
    gulp.watch('app/styles/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch bower files
    gulp.watch('bower.json', ['wiredep']);
});
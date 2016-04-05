(function() {
    'use strict';

    var gulp       = require('gulp'),
        connect    = require('gulp-connect'),
        open       = require('gulp-open'),
        config     = require('./gulp.conf.js'), // configuration file
        typescript = require('gulp-typescript'),
        sourcemaps = require('gulp-sourcemaps'),
        less       = require('gulp-sources-less');

    var tsProject = typescript.createProject('tsconfig.json');

    gulp.task('clean', function(done) {
        var del = require('del');
        del(['dist'], done);
    });

    gulp.task('connect', function() {
        connect.server({
            root: __dirname,
            livereload: true,
            port: config.server.port
        });
    });

    gulp.task('less', function() {
        gulp.src(config.paths.less)
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./dist'))
            .pipe(connect.reload());
    });

    gulp.task('open', ['connect', 'watch', 'less', 'ts2js'], function() {
        gulp
            .src('./index.html')
            .pipe(open({
                uri: config.server.host + ':' + config.server.port
            }));
    });

    gulp.task('run', ['open']);

    gulp.task('ts2js', [], function() {

        var tsResult = gulp
            .src([config.paths.ts, 'node_modules/angular2/typings/browser.d.ts'])
            .pipe(sourcemaps.init())
            .pipe(typescript(tsProject, {
                sortOutput: true
            }));

        return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
            .pipe(connect.reload());
    });

    gulp.task('watch', function() {
        gulp.watch(config.paths.ts, ['ts2js']);
        gulp.watch(config.paths.html, ['ts2js']);
        gulp.watch(config.paths.less, ['less']);
    });

    gulp.task('default', ['run']);

})();

/*
 * @Author: 焦江倩 
 * @Date: 2018-12-03 09:05:03 
 * @Last Modified by: 焦江倩
 * @Last Modified time: 2018-12-03 09:51:56
 */

var gulp = require('gulp');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var server = require('gulp-webserver');

var url = require('url');

var path = require('path');

var fs = require('fs');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var concat = require('gulp-concat');

// 编译scss
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

// 监听
gulp.task('watch', function() {
    return gulp.watch('./src', gulp.series('scss'))
})

// 启服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9999,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname);
                if (pathname === "/favicon.ico") {
                    res.end('');
                    return;
                }
                pathname = pathname === "/" ? 'index.html' : pathname;
                var state = fs.readFileSync(path.join(__dirname, "src", pathname));
                res.end(state);
            }
        }))
})

// 开发环境
gulp.task('dev', gulp.series('scss', 'server', 'watch'));

// 压缩css
gulp.task('bCss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(minCss())
        .pipe(gulp.dest('./build/css'))
})


// 压缩js
gulp.task('bUglify', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})

gulp.task('default', gulp.series('server', 'bUglify', 'scss', 'watch'));
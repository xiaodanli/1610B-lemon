var gulp = require('gulp');

var sass = require('gulp-sass');

var server = require('gulp-webserver');

gulp.task('devSass',function(){
	return gulp.src('./src/scss/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./src/css'))
})

gulp.task('watch',function(){
	return gulp.watch('./src/scss/*.scss',gulp.series('devSass'))
})

gulp.task('devServer',function(){
	return gulp.src('src')
	.pipe(server({
		port:8787,
		proxies:[
			{source:'/classify/api/iconlist',target:'http://localhost:3000/classify/api/iconlist'},
			{source:'/users/api/addUser',target:'http://localhost:3000/users/api/addUser'},
			{source:'/classify/api/addClassify',target:'http://localhost:3000/classify/api/addClassify'}
		]
	}))
})

gulp.task('dev',gulp.series('devSass','devServer','watch'))
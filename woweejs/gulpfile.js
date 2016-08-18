'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	watchify = require('watchify'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify'),
	sourcemaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	babelify = require('babelify'),
	buffer = require('vinyl-buffer'),
	jshint = require('gulp-jshint'),
	parseDae = require('collada-dae-parser'),
	vfs = require('vinyl-fs'),
	map = require('map-stream'),
	bufferJson = require('buffer-json-stream'),
	stream = require('stream');

gulp.task('prod', function(){

	var b = browserify({
		entries: ['./wowee.js'],
		debug: true
	});

	b.transform("babelify", {presets: ["es2015"]});

	b.bundle()
		.pipe(source('wowee.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(rename('wowee.min.js'))
		.pipe(gulp.dest('./dist/'));		
}); 

gulp.task('build', function(){
	
	var b = browserify({
		entries: ['./wowee.js'],
		debug: true
	});

	//b.transform("babelify", {presets: ["es2015"]});

	b.bundle()
		.pipe(source('wowee.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/'));		
});

gulp.task('watch', function(){
	var props = {
	        entries: ['./wowee.js'],
	        debug: true,
	        cache: {},
	        packageCache: {},
	    };
		
	var bundler = watchify(browserify(props));
	
	function rebundle() {
    	
    	var stream = bundler.bundle();
    	return stream.on('error', function(error){
    		console.log(error);
    	}).pipe(source('wowee.js')).pipe(gulp.dest('./dist/'));
	}

	bundler.on('update', function() {
		return rebundle();
	});

  return rebundle();
});

gulp.task( 'lint', function() {
	return gulp.src( './lib/**/*.js' )
	   .pipe( jshint() )
	   .pipe( jshint.reporter( 'default' ) );
});

gulp.task( 'collada', function() {
	var filename;
	return vfs.src('./src/collada/*.dae')
	.pipe(map(function(file, cb){
		
		//var arr = file.path.split('/');
		//filename = arr[arr.length-1].replace('.dae', '.json');
		//console.log(filename);
		var str = JSON.stringify(parseDae(file.contents));
		file.contents = new stream.Readable();
		file.contents._read = function noop() {};
		file.contents.push(str);
		cb(null, file);
	}))
	.pipe(rename({
		extname: '.json'
	}))
	.pipe(vfs.dest('./src/collada/json/'));
});
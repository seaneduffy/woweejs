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
	stream = require('stream'),
	argv = require('yargs').argv;

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

gulp.task( 'wavefront', function() {
	return vfs.src('./src/wavefront/'+argv.m+'.obj')
	.pipe(map(function(file, cb){
		var out = {
			vertices : [],
			normals : [],
			textures: [],
			faces : []
		};
		file.contents.toString().split('\n').forEach(
			function(line){
				var lineArr = line.split(' '),
					id = lineArr[0];
				if(id === 'v') {
					out.vertices.push([
						lineArr[1] * 1,
						lineArr[2] * 1,
						lineArr[3] * 1,
					]);
				} else if(id === 'vn') {
					out.normals.push([
						lineArr[1] * 1,
						lineArr[2] * 1,
						lineArr[3] * 1,
					]);
				} else if(id === 'vt') {
					out.textures.push([
						lineArr[1] * 1,
						lineArr[2] * 1,
						lineArr[3] * 1,
					]);
				} else if(id === 'f') {
					var vertices = [],
						vertexValues,
						vertex;
					lineArr.forEach(function(vertexArr, index){
						if(index !== 0) {
							vertexValues = vertexArr.split('/');
							vertex = {
								vertex : vertexValues[0] * 1 - 1,
								normal : vertexValues[2] * 1 - 1
							}
							if(vertexValues[1] !== ''){
								vertex.texture = vertexValues[1] * 1 - 1;
							}
							vertices.push(vertex);
						}
					});
					out.faces.push(vertices);
				}
			}
		);
		out.faces.forEach(function(face){
			
			face.forEach(function(v) {
				v.vertex = out.vertices[v.vertex];
				v.normal = out.normals[v.normal];
				if(!!v.texture) {
					v.texture = out.textures[v.texture];
				}
			});
		});
		var str = JSON.stringify(out);
		file.contents = new stream.Readable();
		file.contents._read = function noop() {};
		file.contents.push(str);
		cb(null, file);
	}))
	.pipe(rename({
		extname: '.json'
	}))
	.pipe(vfs.dest('./src/3d/'));
});
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

gulp.task( 'wavefront', function(done) {
	
	var materialObj = {},
		materialProps;
	
	vfs.src('./src/wavefront/'+argv.m+'.mtl')
	.pipe(map(function(file, cb){
		file.contents.toString().split('\n').forEach(
			function(line) {
				var lineArr = line.split(' '),
					id = lineArr[0];
				if(id === 'newmtl') {
					materialProps = {};
					materialObj[lineArr[1]] = materialProps;
				} else if(id === 'map_Kd') {
					var a = lineArr[lineArr.length-1].split('/');
					materialProps.filename = a[a.length-1];
				}
			}
		);
		return vfs.src('./src/wavefront/'+argv.m+'.obj')
		.pipe(map(function(file, cb){
	
			var meshes = [],
				mesh,
				startCutCount = true,
				cut = 0,
				cutCount = 0;
			file.contents.toString().split('\n').forEach(
				function(line, index){
					var lineArr = line.split(' '),
						id = lineArr[0],
						v;
					if(id === 'o') {
						mesh = {
							vertices : [],
							normals : [],
							texels: [],
							vertexIndices: [],
							texelIndices: [],
							normalIndices: [],
							material: ''
						};
						meshes.push(mesh);
					} else if(id === 'v') {
							if(startCutCount) {
								startCutCount = false;
								cut += cutCount;
								cutCount = 0;
							}
							cutCount++;
						v = new Array(3);
						v[0] = lineArr[1] * 1;
						v[1] = lineArr[2] * 1;
						v[2] = lineArr[3] * 1;
						mesh.vertices.push(v[0]);
						mesh.vertices.push(v[1]);
						mesh.vertices.push(v[2]);
					} else if(id === 'vn') {
					startCutCount = true;
						v = new Array(3);
						v[0] = lineArr[1] * 1;
						v[1] = lineArr[2] * 1;
						v[2] = lineArr[3] * 1;
						mesh.normals.push(v[0]);
						mesh.normals.push(v[1]);
						mesh.normals.push(v[2]);
					} else if(id === 'vt') {
						mesh.texels.push(lineArr[1] * 1);
						mesh.texels.push(lineArr[2] * 1);
					} else if(id === 'f') {
						lineArr.forEach(function(a, index){
							if(index !== 0) {
								var b = a.split('/');
								mesh.vertexIndices.push(b[0]*1-1 - cut);
								mesh.texelIndices.push(b[1]*1-1 - cut);
								mesh.normalIndices.push(b[2]*1-1 - cut);
							}
						});
					} else if(id === 'usemtl') {
						mesh.material = materialObj[lineArr[1]];
					}
				}
			);
			
			var str = JSON.stringify(meshes);
			file.contents = new stream.Readable();
			file.contents._read = function noop() {};
			file.contents.push(str);
			cb(null, file);
		}))
		.pipe(rename({
			extname: '.json'
		}))
		.pipe(vfs.dest('./src/3d/'))
		.on('end', function(){
			done();
		});
	}))
});
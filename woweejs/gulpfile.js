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
		
	var meta = {
		vertices : [],
		normals : [],
		textures: [],
		faces : []
	};
	
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
				
			

			file.contents.toString().split('\n').forEach(
				function(line){
					var lineArr = line.split(' '),
						id = lineArr[0];
					if(id === 'v') {
						meta.vertices.push([
							lineArr[1] * 1,
							lineArr[2] * 1,
							lineArr[3] * 1,
						]);
					} else if(id === 'vn') {
						meta.normals.push([
							lineArr[1] * 1,
							lineArr[2] * 1,
							lineArr[3] * 1,
						]);
					} else if(id === 'vt') {
						meta.textures.push([
							lineArr[1] * 1,
							lineArr[2] * 1
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
								};
								if(vertexValues[1] !== ''){
									vertex.texture = vertexValues[1] * 1 - 1;
								}
								vertices.push(vertex);
							}
						});
						meta.faces.push(vertices);
					}/* else if(id === 'usemtl') {
						meta.material = materialObj[lineArr[1]];
					}*/
				}
			);
			
			// texels - faces * v/f * 2, vertices - faces * v/f * 3, vertexIndices - triangles * 3 
			// texels - 6 * 4 * 2 = 48   vertices - 6 * 4 * 3 = 72      vertexIndices - 12 * 3 = 36
			// should be 756 vertexIndices, 378 vertices, 504 texels
			// texels - 80 * 3 * 2 = 480, vertices - 80 * 3 * 3 = 720, vertexIndices - 80 * 3 = 240
			
			var maxX = null,
			minX = null,
			maxY = null,
			minY = null,
			maxZ = null,
			minZ = null;
			meta.vertices.forEach(v=>{
				maxX = maxX == null || maxX < v[0] ? v[0] : maxX;
				minX = minX == null || minX > v[0] ? v[0] : minX;
				maxY = maxY == null || maxY < v[1] ? v[1] : maxY;
				minY = minY == null || minY > v[1] ? v[1] : minY;
				maxZ = maxZ == null || maxZ < v[2] ? v[2] : maxZ;
				minZ = minZ == null || minZ > v[2] ? v[2] : minZ;
			});
	
			var xDelta = maxX - minX,
				yDelta = maxY - minY,
				zDelta = maxZ - minZ;
		
			meta.vertices = meta.vertices.map((v, index)=>{

				return [
					(xDelta === 0) ? 0 : (v[0] - minX) / xDelta - .5,
					(yDelta === 0) ? 0 : (v[1] - minY) / yDelta - .5,
					(zDelta === 0) ? 0 : (v[2] - minZ) / zDelta - .5
				];
			});
			
			var out = {
				material: meta.material,
				vertices: [],
				vertexIndices: [],
				texels: []
			};
			
			var counter = 0;
			
			meta.faces.forEach( f => {
				f.forEach( (v, index) => {
					out.vertices.push(meta.vertices[v.vertex][0]);
					out.vertices.push(meta.vertices[v.vertex][1]);
					out.vertices.push(meta.vertices[v.vertex][2]);
					if(!!meta.textures[v.texture]) {
						out.texels.push(meta.textures[v.texture][0]);
						out.texels.push(1-meta.textures[v.texture][1]);
					}
					out.vertexIndices.push(counter);
					counter++;
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
		.pipe(vfs.dest('./src/3d/'))
		.on('end', function(){
			done();
		});
	}))
});
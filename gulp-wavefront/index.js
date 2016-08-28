'use strict';

let	through = require('through2'),
	rename = require('gulp-rename');
	
module.exports = function(){

	var materialObj = {},
		materialProps;

	var meta = {
		vertices : [],
		normals : [],
		textures: [],
		faces : []
	};

	return through.obj(function(file, enc, cb) {
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
				}
			}
		);
	
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
		file.contents = new Buffer(JSON.stringify(out));
		let fArr = file.path.split('/'),
			f = fArr[fArr.length-1];
		fArr[fArr.length-1] = f.replace('.obj', '.json');
		file.path = fArr.join('/');
		cb(null, file);
	});
};
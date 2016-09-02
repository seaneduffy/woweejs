'use strict';

let glm = require('gl-matrix'),
	load = require('../../../async/load'),
	gl = viewport.gl,
	materialPath = null;
	
function Mesh() {
	this.dataLoaded = false;
}

Mesh.prototype = Object.create(null);

Mesh.prototype.load = function(src){

	return new Promise((resolve, reject)=>{
		if(this.dataLoaded === src) {
			resolve();
			return;
		}
		load(src, 'image').then(data=>{
			this.data = data;
			this.dataLoaded = src;
			this.vertexLength = data.vertexIndices.length;
			this.vertexIndices = data.vertexIndices;
			this.vertices = data.vertices;
			this.texels = data.texels;
			resolve();
		});
	});
}

module.exports = Mesh;
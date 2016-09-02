'use strict';

let glm = require('gl-matrix'),
	load = require('../../async/load'),
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl,
	materialPath = null,

	meshes = {};
	
function Mesh() {}

Mesh.prototype = Object.create(null);

Mesh.prototype.initBuffers = function(){

	if(this.vertexBuffer == null || this.vertexBuffer === 'undefined') {
		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
	}
	
	if(!!this.texture && !!this.texels && (this.textureBuffer == null || this.textureBuffer === 'undefined')) {
		this.textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texels), gl.STATIC_DRAW);
	}
}

function loadMesh(src){

	return new Promise((resolve, reject)=>{

		if(!!meshes[src]) {
			resolve(meshes[src]);
		}
		load(src).then(data=>{
			let m = new Mesh();
			m.data = data;
			m.dataLoaded = src;
			m.vertexLength = data.vertexIndices.length;
			m.vertexIndices = data.vertexIndices;
			m.vertices = data.vertices;
			m.texels = data.texels;
			m.initBuffers();
			resolve(m);
		});
	});
}

module.exports = {
	load : loadMesh
}
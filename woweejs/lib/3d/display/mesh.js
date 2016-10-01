'use strict';

let glm = require('gl-matrix'),
	load = require('../../async/load'),
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl,
	materialPath = null,
	meshData = {};
	
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
		window.vertexBuffer = this.vertexBuffer;
		window.indexBuffer = this.indexBuffer;
	}
	
	if(!!this.texels && (this.textureBuffer == null || this.textureBuffer === 'undefined')) {
		this.textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texels), gl.STATIC_DRAW);
	}
};

Mesh.prototype.init = function(data) {
	this.data = data;
	this.vertexLength = data.vertexIndices.length;
	this.vertexIndices = data.vertexIndices;
	this.vertices = data.vertices;
	this.texels = data.texels;
	this.initBuffers();
};

Mesh.prototype.load = function(src){

	return new Promise((resolve, reject)=>{

		if(!!meshData[src]) {
			this.init(meshData[src]);
			resolve();
		}
		load(src).then(data=>{
			meshData[src] = data;
			this.init(data);
			resolve();
		});
	});
};

module.exports = Mesh;
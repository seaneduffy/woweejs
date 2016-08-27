'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	load = require('../../async/load'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh/mesh'),
	TextureShader = require('../../3d/display/shaders/texture'),
	ColorShader = require('../../3d/display/shaders/color'),
	viewport = require('../../3d/scene/viewport')(),
	gl = viewport.gl,
	materialPath = null;

function DisplayObject3D(config) {

	SceneNode.prototype.constructor.call(this);
	
	this.config = config;

}

DisplayObject3D.prototype = Object.create(SceneNode.prototype);

DisplayObject3D.prototype.loadMaterial = function() {
	
	return new Promise((resolve, reject)=>{
		if(!!this.config.material){
			load(this.config.material, 'image').then(image=>{
				this.material = image;
				resolve();
			});
		} else {
			resolve();
		}
	});
};

DisplayObject3D.prototype.loadMesh = function() {
	
	return new Promise((resolve, reject)=>{
		if(!!this.config.mesh){
			load(this.config.mesh).then(data=>{
				this.mesh = data;
				resolve();
			});
		} else {
			resolve();
		}
	});
};

DisplayObject3D.prototype.init = function() {

	return new Promise( (resolve, reject) => {

		return this.loadMaterial().then(()=>{
			return this.loadMesh();
		}).then(()=>{
			this.initShaders();
			this.initBuffers();
			resolve();
		});

	});
};

DisplayObject3D.prototype.initShaders = function() {

	this.shaders = [];

	if(!!this.config.shaders) {
		this.shaders = this.config.shaders.map( shader => {
			let s = null;
			if(shader.type === 'color') {
				s = new ColorShader(shader.r, shader.g, shader.b, shader.a);
			} else if(shader.type === 'texture') {
				s = new TextureShader(this.material);
			}
			s.shapes = shader.shapes;
			return s;
		});
	}
}

DisplayObject3D.prototype.initBuffers = function(){
	
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
	
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.vertexIndices), gl.STATIC_DRAW);
	
	if(!!this.material) {
		this.textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.texels), gl.STATIC_DRAW);
	}
}

DisplayObject3D.prototype.render = function(camera){
	
	if(typeof this.shaders === 'undefined') {
		return;
	}

	this.shaders.forEach( shader => {
		
		if(!!this.config && this.config.isPlane) {
			gl.disable(gl.CULL_FACE);
		} else if(!!this.config && !this.config.isPlane) {
			gl.enable(gl.CULL_FACE);
		}
		gl.useProgram(shader.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		if(!!shader.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
			gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, shader.texture);
		}
		gl.uniform1i(gl.getUniformLocation(shader.program, "uSampler"), 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		var pUniform = gl.getUniformLocation(shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		
		gl.drawArrays(gl[shader.shapes], 0, this.mesh.vertexIndices.length);
	});

};

module.exports = DisplayObject3D;
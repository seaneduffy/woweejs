'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl,
	DisplayObject3D = require('../../3d/display/displayObject3D'),
	Log = require('../../log');

function Graphics() {
	DisplayObject3D.prototype.constructor.call(this);
	this.graphics = [];
}

Graphics.prototype = Object.create(DisplayObject3D.prototype);

Graphics.prototype.constructor = Graphics;

Graphics.prototype.draw = function(points, method){
	
	this.vertexBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();
	this.vertexes = [];
	this.vertexIndexes = [];
	this.method = method;

	points.forEach( (point, index) => {
		point.forEach( v => {
			this.vertexes.push(v);
		});
		this.vertexIndexes.push(index);
	});
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexes), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndexes), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

Graphics.prototype.render = function(camera){
	if(typeof this.material === 'undefined' 
		|| this.vertexBuffer === 'undefined' 
		|| this.indexBuffer === 'undefined') {
		return ;
	}
	mat4.mul(this.mvpMat4, camera.pvMatrix, this.transform);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	mat4.invert(this.invModelMat4, this.transform);
	this.material.apply(this.mvpMat4, this.transform, this.invModelMat4, camera.pvMatrix, this.vertexBuffer, null);
	gl.drawArrays(this.method, 0, this.vertexIndexes.length);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	this.material.remove();
};


module.exports = Graphics;
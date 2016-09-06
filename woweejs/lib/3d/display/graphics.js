'use strict';

let viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl,
	ColorShader = require('../../3d/display/shaders/color'),
	TextureShader = require('../../3d/display/shaders/texture'),
	DisplayObject3D = require('../../3d/display/displayObject3D'),
	Log = require('../../log');

function Graphics() {
	DisplayObject3D.prototype.constructor.call(this);
	this.graphics = [];
}

Graphics.prototype = Object.create(DisplayObject3D.prototype);

Graphics.prototype.constructor = Graphics;

Graphics.prototype.drawLine = function(points, shader){
	
	let graphicsObj = {
		vertexBuffer : gl.createBuffer(),
		indexBuffer : gl.createBuffer(),
		texelsBuffer : gl.createBuffer(),
		vertices : [],
		vertexIndices : [],
		shader: shader
	};

	this.graphics.push(graphicsObj);

	points.forEach( (point, index) => {
		point.forEach( v => {
			graphicsObj.vertices.push(v);
		});
		graphicsObj.vertexIndices.push(index);
	});
	gl.bindBuffer(gl.ARRAY_BUFFER, graphicsObj.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graphicsObj.vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphicsObj.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(graphicsObj.vertexIndices), gl.STATIC_DRAW);
};

Graphics.prototype.render = function(camera){

	this.graphics.forEach( graphic => {

		//this.switchPrograms(graphic.shader.program);

		gl.enableVertexAttribArray(graphic.shader.vertexPositionAttribute);

		gl.useProgram(graphic.shader.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, graphic.vertexBuffer);
		gl.vertexAttribPointer(graphic.shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.uniform1f(gl.getUniformLocation(graphic.shader.program, "uSampler"), 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphic.indexBuffer);

		var pUniform = gl.getUniformLocation(graphic.shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(graphic.shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		gl.drawArrays(graphic.shader.shapes, 0, graphic.vertexIndices.length);

		gl.disableVertexAttribArray(graphic.shader.vertexPositionAttribute);
	});

};


module.exports = Graphics;
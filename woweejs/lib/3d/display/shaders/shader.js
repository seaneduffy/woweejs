'use strict';

let shaderIdCounter = 0;

function Shader(shapes) {
	this.shapes = shapes;
	this.id = shaderIdCounter++;
}

module.exports = Shader;
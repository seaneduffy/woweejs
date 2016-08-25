'use strict';

let shaderIdCounter = 0;

function Shader() {
	this.id = shaderIdCounter++;
}

module.exports = Shader;
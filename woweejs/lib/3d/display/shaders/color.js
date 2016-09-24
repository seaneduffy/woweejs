'use strict';

let viewport = require('../../../3d/scene/viewport').getViewport(),
	Shader = require('../../../3d/display/shader'),
	gl = viewport.gl;
	
var vertexShaderSource = 
'attribute vec3 aVertexPosition%ID;\
uniform mat4 uMVMatrix;\
uniform mat4 uPMatrix;\
void main(void) {\
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition%ID, 1.0);\
}';

var fragmentShaderSource = 
'void main(void) {\
	gl_FragColor = vec4(%R, %G, %B, %A);\
}';


function ColorShader(r, g, b, a, shapes) {

	Shader.prototype.constructor.call(this, shapes);
	
	this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    
    gl.shaderSource(this.vertexShader, vertexShaderSource.replace(new RegExp(/\%ID/g), this.id+''));
	
	gl.compileShader(this.vertexShader);
	
	this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
    gl.shaderSource(this.fragmentShader, fragmentShaderSource
		.replace('%R', r+'')
		.replace('%G', g+'')
		.replace('%B', b+'')
		.replace('%A', a+''));

	gl.compileShader(this.fragmentShader);
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vertexShader);
	gl.attachShader(this.program, this.fragmentShader);

	gl.linkProgram(this.program);
	
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition"+this.id);
}

ColorShader.prototype = Object.create(Shader.prototype);
ColorShader.prototype.constructor = ColorShader;

module.exports = ColorShader;
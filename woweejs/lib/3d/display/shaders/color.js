'use strict';

let viewport = require('../../../3d/scene/viewport')(),
	Shader = require('../../../3d/display/shaders/shader'),
	gl = viewport.gl;
	
var vertexShaderSource = 
'attribute vec3 aVertexPosition;\
uniform mat4 uMVMatrix;\
uniform mat4 uPMatrix;\
void main(void) {\
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
}';

var fragmentShaderSource = 
'void main(void) {\
	gl_FragColor = vec4(%R, %G, %B, %A);\
}';


var vertexShaderSource1 = 
'attribute vec3 aVertexPosition;\
attribute vec2 aTextureCoord;\
uniform mat4 uMVMatrix;\
uniform mat4 uPMatrix;\
varying highp vec2 vTextureCoord;\
void main(void) {\
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
	vTextureCoord = aTextureCoord;\
}';

var fragmentShaderSource1 = 
'varying highp vec2 vTextureCoord;\
uniform sampler2D uSampler;\
void main(void) {\
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
}';


function ColorShader(r, g, b, a) {

	Shader.prototype.constructor.call(this);
	
	this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    
    gl.shaderSource(this.vertexShader, vertexShaderSource);
	
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
	
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	
	gl.enableVertexAttribArray(this.vertexPositionAttribute);
}

ColorShader.prototype = Object.create(Shader.prototype);
ColorShader.prototype.constructor = ColorShader;

module.exports = ColorShader;
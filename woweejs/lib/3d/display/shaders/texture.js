'use strict';

let viewport = require('../../../3d/scene/viewport').getViewport(),
	Shader = require('../../../3d/display/shaders/shader'),
	gl = viewport.gl;
	
var vertexShaderSource = 
'attribute vec3 aVertexPosition%ID;\
attribute vec2 aTextureCoord%ID;\
uniform mat4 uMVMatrix;\
uniform mat4 uPMatrix;\
varying highp vec2 vTextureCoord;\
void main(void) {\
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition%ID, 1.0);\
	vTextureCoord = aTextureCoord%ID;\
}';

var fragmentShaderSource = 
'varying highp vec2 vTextureCoord;\
uniform sampler2D uSampler;\
void main(void) {\
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
}';

function TextureShader() {
	Shader.prototype.constructor.call(this);
	this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource.replace(new RegExp(/\%ID/g), this.id+''));
	gl.compileShader(this.vertexShader);
	
	this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource);
	gl.compileShader(this.fragmentShader);
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vertexShader);
	gl.attachShader(this.program, this.fragmentShader);

	gl.linkProgram(this.program);
	
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition"+this.id);
	//gl.enableVertexAttribArray(this.vertexPositionAttribute);
	this.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord"+this.id);
	//gl.enableVertexAttribArray(this.textureCoordAttribute);

	this.shapes = gl.TRIANGLES;
}

TextureShader.prototype = Object.create(Shader.prototype);
TextureShader.prototype.constructor = TextureShader;
module.exports = TextureShader;
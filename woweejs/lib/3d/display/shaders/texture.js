'use strict';

let viewport = require('../../../3d/scene/viewport')(),
	Shader = require('../../../3d/display/shaders/shader'),
	gl = viewport.gl;
	
var vertexShaderSource = 
'attribute vec3 aVertexPosition;\
attribute vec2 aTextureCoord;\
uniform mat4 uMVMatrix;\
uniform mat4 uPMatrix;\
varying highp vec2 vTextureCoord;\
void main(void) {\
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
	vTextureCoord = aTextureCoord;\
}';

var fragmentShaderSource = 
'varying highp vec2 vTextureCoord;\
uniform sampler2D uSampler;\
void main(void) {\
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
}';

function Texture(image) {
	Shader.prototype.constructor.call(this);
	this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vertexShader, vertexShaderSource);
	gl.compileShader(this.vertexShader);
	
	this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fragmentShader, fragmentShaderSource);
	gl.compileShader(this.fragmentShader);
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vertexShader);
	gl.attachShader(this.program, this.fragmentShader);

	gl.linkProgram(this.program);
	
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.vertexPositionAttribute);
	this.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.textureCoordAttribute);
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
}

Texture.prototype = Object.create(Shader.prototype);
Texture.prototype.constructor = Texture;
module.exports = Texture;
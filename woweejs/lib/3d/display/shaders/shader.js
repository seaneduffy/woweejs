'use strict';

let load = require('../../../async/load'),
	viewport = require('../../../3d/scene/viewport').getViewport(),
	gl = viewport.gl;


Shader.FRAGMENT = 'fragment';
Shader.VERTEX = 'vertex';

function Shader() {
	
}

Object.defineProperties(Shader.prototype, {
	'vertexSource': {
		get: function(){
			if(!!this._vertexSource) {
				return this._vertexSource;
			}
			throw 'Vertex source requested but not set.';
		},
		set: function(s){
			this._vertexSource = s;
		}
	},
	'fragmentSource': {
		get: function(){
			if(!!this._fragmentSource) {
				return this._fragmentSource;
			}
			throw 'Fragment source requested but not set.';
		},
		set: function(s){
			this._fragmentSource = s;
		}
	}
});

Shader.prototype.createProgram = function() {
	if(typeof this.fragmentShader === 'undefined') {
		return;
	}

	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vertexShader);
	gl.attachShader(this.program, this.fragmentShader);

	gl.linkProgram(this.program);

}

Shader.prototype.createShader = function(type) {
	if(type === Shader.FRAGMENT) {
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(this.fragmentShader, fragmentShaderSource);
		gl.compileShader(this.fragmentShader);
		this.createProgram();
	} else if(type === Shader.VERTEX) {
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    	gl.shaderSource(this.vertexShader, this.vertexSource);
		gl.compileShader(this.vertexShader);
		this.createProgram();
	}
}

Shader.prototype.loadSource = function(src, type) {

	return new Promise(function(resolve, reject){
		load(src).then(function(source) {

			if(type === Shader.FRAGMENT) {
				this.fragmentSource = source;		
			} else if(type === Shader.VERTEX) {
				this.vertexSource = source;		
			}

			resolve();
			
		})
	});
}

	
	
	
	
	
	
	this.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition"+this.id);
	//gl.enableVertexAttribArray(this.vertexPositionAttribute);
	this.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord"+this.id);
	//gl.enableVertexAttribArray(this.textureCoordAttribute);

	this.shapes = gl.TRIANGLES;
}

TextureShader.prototype = Object.create(Shader.prototype);
TextureShader.prototype.constructor = TextureShader;
module.exports = TextureShader;

module.exports = Shader;
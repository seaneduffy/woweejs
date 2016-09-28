'use strict';

let load = require('../../async/load'),
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl,
	indexCount = 0;


Shader.FRAGMENT = 'fragment';
Shader.VERTEX = 'vertex';
Shader.VERTEX_SHADER_TYPEID_STRING   = "x-shader/x-vertex";
Shader.FRAGMENT_SHADER_TYPEID_STRING = "x-shader/x-fragment";
Shader.REGEXP_PARSE_UNIFORM_VARS   = /^uniform(.*);$/gm;
Shader.REGEXP_PARSE_VERTEX_ATTRIBS = /^attribute(.*);$/gm;

Shader.ATTRIB_NAME_POSITION = 'a_position';
Shader.ATTRIB_NAME_NORMAL = 'a_normal';
Shader.ATTRIB_NAME_TANGENT = 'a_tangent';
Shader.ATTRIB_NAME_BITANGENT = 'a_bitangent';
Shader.ATTRIB_NAME_TEXCOORDS = 'a_texcoords';
Shader.ATTRIB_NAME_COLOR = 'a_color';
Shader.VERT_SIZE_POSITION = 3;
Shader.VERT_SIZE_NORMAL = 3;
Shader.VERT_SIZE_TANGENT = 3;
Shader.VERT_SIZE_BITANGENT = 3;
Shader.VERT_SIZE_TEXCOORDS = 2;
Shader.VERT_SIZE_COLOR = 4;
Shader.VERT_OFFSET_POSITION  = 0;
Shader.VERT_OFFSET_NORMAL    = (3 * 4);
Shader.VERT_OFFSET_TANGENT   = (3 * 4) + (3 * 4);
Shader.VERT_OFFSET_BITANGENT = (3 * 4) + (3 * 4) + (3 * 4);
Shader.VERT_OFFSET_TEXCOORDS = (3 * 4) + (3 * 4) + (3 * 4) + (3 * 4);
Shader.VERT_OFFSET_COLOR     = (3 * 4) + (3 * 4) + (3 * 4) + (3 * 4) + (2 * 4);

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

	this.program = gl.createProgram();
	gl.attachShader(this.program, this.vertexShader);
	gl.attachShader(this.program, this.fragmentShader);
	gl.linkProgram(this.program);

};

Shader.prototype.hasUniform = function(uniform_str) {
	return this.uniformVarNames.find( n => {
		return n === uniform_str;
	});
};

Shader.prototype.setUniform1i = function (varName, ival) { // -> bool
	/*if (!this.validateSetUniformParams(varName, ival)) {
		return false;
	}*/
	gl.uniform1i(this.uniformVars[varName], ival);
	return true;
};

Shader.prototype.setUniform1f = function (varName, fval) { // -> bool
	/*if (!this.validateSetUniformParams(varName, fval)) {
		return false;
	}*/
	gl.uniform1f(this.uniformVars[varName], fval);
	return true;
};

Shader.prototype.setUniformVec2 = function (varName, v2) { // -> bool
	/*if (!this.validateSetUniformParams(varName, v2)) {
		return false;
	}*/
	gl.uniform2fv(this.uniformVars[varName], v2);
	return true;
};

Shader.prototype.setUniformVec3 = function (varName, v3) { // -> bool
	/*if (!this.validateSetUniformParams(varName, v3)) {
		return false;
	}*/
	gl.uniform3fv(this.uniformVars[varName], v3);
	return true;
};

Shader.prototype.setUniformVec4 = function (varName, v4) { // -> bool
	/*if (!this.validateSetUniformParams(varName, v4)) {
		return false;
	}*/
	gl.uniform4fv(this.uniformVars[varName], v4);
	return true;
};

Shader.prototype.setUniformMat4 = function (varName, m4) { // -> bool
	/*if (!this.validateSetUniformParams(varName, m4x4)) {
		return false;
	}*/
	gl.uniformMatrix4fv(this.uniformVars[varName], false, m4);
	return true;
};

Shader.prototype.createShader = function(type) {
	if(type === Shader.FRAGMENT) {
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(this.fragmentShader, this.fragmentSource);
		gl.compileShader(this.fragmentShader);
	} else if(type === Shader.VERTEX) {
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    	gl.shaderSource(this.vertexShader, this.vertexSource);
		gl.compileShader(this.vertexShader);
	}
};

Shader.prototype.bind = function() {

	gl.useProgram(this.program);

	let attribName = null,
		vertSize = null,
		vertOffset = null;

	for(attribName in this.vertexAttribs){
		console.log(attribName);
		if(attribName === Shader.ATTRIB_NAME_POSITION) {
			vertSize = Shader.VERT_SIZE_POSITION;
			vertOffset = Shader.VERT_OFFSET_POSITION;
		} else if(attribName === Shader.ATTRIB_NAME_NORMAL) {
			vertSize = Shader.VERT_SIZE_NORMAL;
			vertOffset = Shader.VERT_OFFSET_NORMAL;
		} else if(attribName === Shader.ATTRIB_NAME_TANGENT) {
			vertSize = Shader.VERT_SIZE_TANGENT;
			vertOffset = Shader.VERT_OFFSET_TANGENT;
		} else if(attribName === Shader.ATTRIB_NAME_BITANGENT) {
			vertSize = Shader.VERT_SIZE_BITANGENT;
			vertOffset = Shader.VERT_OFFSET_BITANGENT;
		} else if(attribName === Shader.ATTRIB_NAME_TEXCOORDS) {
			vertSize = Shader.VERT_SIZE_TEXCOORDS;
			vertOffset = Shader.VERT_OFFSET_TEXCOORDS;
		} else if(attribName === Shader.ATTRIB_NAME_COLOR) {
			vertSize = Shader.VERT_SIZE_COLOR;
			vertOffset = Shader.VERT_OFFSET_COLOR;
		}

		gl.enableVertexAttribArray(this.vertexAttribs[attribName]);
		gl.vertexAttribPointer(this.vertexAttribs[attribName], vertSize,
			gl.FLOAT, false, Shader.VERTEX_SIZE_BYTES, vertOffset);
	}
}

Shader.prototype.unbind = function() {

	gl.useProgram(null);

	let attribName = null;

	for(attribName in this.vertexAttribs){
		gl.disableVertexAttribArray(this.vertexAttribs[attribName]);
	}
}

Shader.prototype.init = function(vertSrc, fragSrc) {
	return new Promise((resolve, reject)=>{
		this.loadSource(vertSrc, Shader.VERTEX)
		.then(()=>{
			return this.loadSource(fragSrc, Shader.FRAGMENT);
		})
		.then(()=>{
			this.parseVertexAttribNamesFromSource();
			this.parseUniformVarNamesFromSource();
			this.createShader(Shader.FRAGMENT);
			this.createShader(Shader.VERTEX);
			this.createProgram();
			this.uniformVars = {};
			this.uniformIndexes = {};
			this.vertexAttribs = {};
			this.uniformVarNames.forEach( n => {
				this.uniformVars[n] = gl.getUniformLocation(this.program, n);
			});
			this.vertexAttribNames.forEach( n => {
				this.vertexAttribs[n] = gl.getAttribLocation(this.program, n);
			});
			resolve();
		})
	});
}



Shader.prototype.loadSource = function(src, type) {

	return new Promise((resolve, reject)=>{

		load(src, 'text').then(source=>{

			if(type === Shader.FRAGMENT) {
				this.fragmentSource = source;
			} else if(type === Shader.VERTEX) {
				this.vertexSource = source;
			}

			resolve();
			
		})
	});
};

Shader.prototype.parseVertexAttribNamesFromSource = function() {
	let source = this.vertexSource;
	let m = source.match(Shader.REGEXP_PARSE_VERTEX_ATTRIBS);
	this.vertexAttribNames = m.map(str=>{
		let arr = str.split(' ');
		str = arr[arr.length-1];
		return str.replace(';', '');
	});
};

Shader.prototype.parseUniformVarNamesFromSource = function() {

	let source = this.vertexSource + this.fragmentSource;
	let m = source.match(Shader.REGEXP_PARSE_UNIFORM_VARS);
	this.uniformVarNames = m.map(str=>{
		let arr = str.split(' ');
		str = arr[arr.length-1];
		return str.replace(';', '');
	});
};

module.exports = Shader;
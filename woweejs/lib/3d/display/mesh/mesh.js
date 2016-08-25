'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	vec2 = glm.vec2,
	mat3 = glm.mat3,
	mat4 = glm.mat4,
	load = require('../../../async/load'),
	Face = require('../../../3d/display/mesh/face'),
	Camera = require('../../../3d/scene/camera'),
	viewport = require('../../../3d/scene/viewport')(),
	TextureShader = require('../../../3d/display/shaders/texture'),
	ColorShader = require('../../../3d/display/shaders/color'),
	gl = viewport.gl,
	materialPath = null;
	
Mesh.setMaterialPath = function(path) {
	materialPath = path;
};
	
function Mesh(data, cb) {
	
	this.data = data;
	console.log(this.data);
	
	this.verticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data.vertices), gl.STATIC_DRAW);
	this.verticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array(this.data.vertexIndices), gl.STATIC_DRAW);
	
	if(!!data.material && !!data.material.filename) {
		load(materialPath + data.material.filename, 'image').then(image=>{
			this.textureImage = image;
			this.initTexture();
			this.shader = new TextureShader();
			cb();
		});
	} else {
		this.whiteShader = new ColorShader(1.0, 1.0, 1.0, 1.0);
		this.redShader = new ColorShader(1.0, 0.0, 0.0, 1.0);
		cb();
	}
}

Object.defineProperties(Mesh.prototype, {
	'texture': {
		get: function(){
			return this._texture;
		},
		set: function(texture) {
			this._texture = texture;
		}
	},
	'data': {
		get: function(){
			return this._data;
		},
		set: function(data){
			this._data = data;
		}
	},
	'faces': {
		get: function(){
			return this._faces;
		},
		set: function(faces){
			this._faces = faces;
		}
	}
});

Mesh.prototype.initTexture = function() {
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	this.verticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data.texels), gl.STATIC_DRAW);
	
};

Mesh.prototype.render = function(camera, transform) {
	gl.useProgram(this.shader.program);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
	gl.vertexAttribPointer(this.shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	if(!!this.texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureCoordBuffer);
		gl.vertexAttribPointer(this.shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
	gl.uniform1i(gl.getUniformLocation(this.shader.program, "uSampler"), 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);

	var pUniform = gl.getUniformLocation(this.shader.program, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

	  var mvUniform = gl.getUniformLocation(this.shader.program, "uMVMatrix");
	  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(transform));
	
	gl.drawElements(gl.TRIANGLES, this.data.vertexIndices.length, gl.UNSIGNED_SHORT, 0);

};

module.exports = Mesh;
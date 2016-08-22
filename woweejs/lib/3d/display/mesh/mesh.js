'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	vec2 = glm.vec2,
	mat3 = glm.mat3,
	Face = require('./face'),
	Camera = require('../../scene/camera'),
	viewport = require('../../scene/viewport')(),
	gl = viewport.gl;
	
function Mesh() {
	this.texture = gl.createTexture();
	this.textureCoordBuffer = gl.createBuffer();
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
			this.initTexture();
		}
	},
	'faces': {
		get: function(){
			return this._faces;
		},
		set: function(faces){
			this._faces = faces;
		}
	},
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			viewport.addFaces(this.faces);
		}
	}
});

Mesh.prototype.initTexture = function() {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
};

Mesh.prototype.addTextureImage = function(src) {
	let image = new Image();
	image.onload = ()=>{
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	image.src = src;
};

Mesh.prototype.render = function(camera, transform) {
	this.faces.forEach(face=>{
		face.render(camera, transform);
	});
};

Mesh.prototype.createFaces = function(vertices) {
	
	// original position vec3, texture vertex2, transform texture vertex2
	// transform position vec3
	// original normal vec3
	// transform normal vec3
	// texture position vec2
	// transform texture vec2
	// projection position vec2
	
	return vertices.map(data => {
		
		let face = new Face();
		
		face.positionVertices = new Array(data.length);
		face.transformVertices = new Array(data.length);
		face.normals = new Array(data.length);
		face.textureVertices = !!data[0][2] ? new Array(data.length) : false;
		face.projectionVertices = new Array(data.length);
		
		data.forEach((v, index) => {
			face.positionVertices[index] = vec3.set(new Float32Array(3), v[0][0], v[0][1], v[0][2]);
			face.transformVertices[index] = new Float32Array(3);
			face.normals[index] = vec3.set(new Float32Array(3), v[1][0], v[1][1], v[1][2]);
			face.projectionVertices[index] = new Float32Array(2);
			if(!!face.textureVertices) {
				face.textureVertices[index] = vec2.set(new Float32Array(2), v[2][0], v[2][1]);
			}
		});
		
		face.texture = this.texture;
		
		return face;
	})
};

module.exports = Mesh;
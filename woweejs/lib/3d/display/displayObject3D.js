'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	vec3 = glm.vec3,
	quat = glm.quat,
	load = require('../../async/load'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh'),
	TextureShader = require('../../3d/display/shaders/texture'),
	ColorShader = require('../../3d/display/shaders/color'),
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl;

function DisplayObject3D() {

	SceneNode.prototype.constructor.call(this);
	this.shaders = [];
	
}

DisplayObject3D.prototype = Object.create(SceneNode.prototype, {
	'drx': {
		get: function() {
			if(!!this._drx) {
				return this._drx;
			}
			return this._drx = 0;
		},
		set: function(drx) {
			this._drx = drx;
		}
	},
	'dry': {
		get: function() {
			if(!!this._dry) {
				return this._dry;
			}
			return this._dry = 0;
		},
		set: function(dry) {
			this._dry = dry;
		}
	},
	'drz': {
		get: function() {
			if(!!this._drz) {
				return this._drz;
			}
			return this._drz = 0;
		},
		set: function(drz) {
			this._drz = drz;
		}
	}
});

DisplayObject3D.prototype.constructor = DisplayObject3D;

DisplayObject3D.prototype.addShader = function(s) {
	this.shaders.push(s);
}

DisplayObject3D.prototype.render = function(camera){
	

	if(typeof this.indexBuffer === 'undefined' || 
		typeof this.vertexBuffer === 'undefined' || 
		typeof this.shaders === 'undefined' ||
		 this.mesh.vertexLength === 0) {
		return;
	}

	this.shaders.forEach( shader => {

		gl.useProgram(shader.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		if(!!shader.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
			gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, shader.texture);
			gl.uniform1i(gl.getUniformLocation(shader.program, "uSampler"), 0);
		} else {
			gl.uniform1f(gl.getUniformLocation(shader.program, "uSampler"), 0);
		}

		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		var pUniform = gl.getUniformLocation(shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		
		gl.drawArrays(gl[shader.shapes], 0, this.mesh.vertexLength);
		//gl.drawElements(gl[shader.shapes], this.mesh.vertexIndices.length, gl.UNSIGNED_SHORT, 0);
	});

};

module.exports = DisplayObject3D;
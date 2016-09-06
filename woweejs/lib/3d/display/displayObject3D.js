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

	window.gl = viewport.gl;

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

DisplayObject3D.prototype.switchPrograms = function(program) {

	if(!!DisplayObject3D.currProgram) {

		let currentAttributes = gl.getProgramParameter(DisplayObject3D.currProgram, gl.ACTIVE_ATTRIBUTES),
			newAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		
		/*if (newAttributes > currentAttributes) {
			for (var i = currentAttributes; i < newAttributes; i++) {
				gl.enableVertexAttribArray(i);
			}
		} else if (newAttributes < currentAttributes) {
			for (var i = newAttributes; i < currentAttributes; i++) {
				gl.disableVertexAttribArray(i);
			}
		}*/

		if (newAttributes < 2) {
			gl.enableVertexAttribArray(1);
		} else {
			gl.disableVertexAttribArray(1);
		}

		//console.log(newAttributes);

	}

	gl.useProgram(program);

	DisplayObject3D.currProgram = program;
}

DisplayObject3D.prototype.render = function(camera){

	this.children.forEach( child=>{
		child.updateWorldTransform(this.transform);
	});

	if(typeof this.mesh === 'undefined') {
		return;
	}

	this.shaders.forEach( shader => {

		gl.enableVertexAttribArray(shader.vertexPositionAttribute);
		gl.enableVertexAttribArray(shader.textureCoordAttribute);
		
		gl.useProgram(shader.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		if(!!this.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
			gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(gl.getUniformLocation(shader.program, "uSampler"), 0);
		} else {
			gl.uniform1f(gl.getUniformLocation(shader.program, "uSampler"), 0);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);

		var pUniform = gl.getUniformLocation(shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		gl.drawArrays(shader.shapes, 0, this.mesh.vertexLength);

		gl.disableVertexAttribArray(shader.vertexPositionAttribute);
		gl.disableVertexAttribArray(shader.textureCoordAttribute);
	});

};

module.exports = DisplayObject3D;
'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	vec3 = glm.vec3,
	quat = glm.quat,
	load = require('../../async/load'),
	Cycle = require('../../animation/cycle'),
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
	this.zVec = vec3.fromValues(0, 0, 1);
	this.yVec = vec3.fromValues(0, 1, 0);
	this.xVec = vec3.fromValues(1, 0, 0);
	this.globalZVec = vec3.fromValues(0, 0, 1);
	this.globalYVec = vec3.fromValues(0, 1, 0);
	this.globalXVec = vec3.fromValues(1, 0, 0);
	this.yawQuat = quat.create();
	this.pitchQuat = quat.create();
	this.rollQuat = quat.create();
	this.forceVec = vec3.create();
	this.velocity = vec3.create();
	this.cycleMove = this.move.bind(this);
	Cycle.add(this.cycleMove);
	
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

DisplayObject3D.prototype.move = function(){

	vec3.add(this.translationVec, this.translationVec, this.velocity);
	this.updateTransform();
}

DisplayObject3D.prototype.roll = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.rollQuat, this.zVec, amount);
	vec3.transformQuat(this.xVec, this.xVec, this.rollQuat);
	vec3.transformQuat(this.yVec, this.yVec, this.rollQuat);
	vec3.normalize(this.xVec, this.xVec);
	vec3.normalize(this.yVec, this.yVec);
	// roll rotation
	quat.setAxisAngle(this.rollQuat, this.globalZVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.rollQuat);

}

DisplayObject3D.prototype.pitch = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.pitchQuat, this.xVec, amount);
	vec3.transformQuat(this.zVec, this.zVec, this.pitchQuat);
	vec3.transformQuat(this.yVec, this.yVec, this.pitchQuat);
	vec3.normalize(this.zVec, this.zVec);
	vec3.normalize(this.yVec, this.yVec);

	// roll rotation
	quat.setAxisAngle(this.pitchQuat, this.globalXVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.pitchQuat);
}

DisplayObject3D.prototype.yaw = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.yawQuat, this.yVec, amount);
	vec3.transformQuat(this.zVec, this.zVec, this.yawQuat);
	vec3.transformQuat(this.xVec, this.xVec, this.yawQuat);
	vec3.normalize(this.zVec, this.zVec);
	vec3.normalize(this.xVec, this.xVec);

	// roll rotation
	quat.setAxisAngle(this.yawQuat, this.globalYVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.yawQuat);
}

DisplayObject3D.prototype.force = function(direction, amount) {
	vec3.scale(this.forceVec, direction, amount);
	vec3.add(this.velocity, this.velocity, this.forceVec);
	
}

DisplayObject3D.prototype.addShader = function(s) {
	this.shaders.push(s);
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
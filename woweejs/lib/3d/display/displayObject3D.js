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

DisplayObject3D.ATTRIB_INDEX_POSITION  = 0;
DisplayObject3D.ATTRIB_INDEX_NORMAL    = 1;
DisplayObject3D.ATTRIB_INDEX_TANGENT   = 2;
DisplayObject3D.ATTRIB_INDEX_BITANGENT = 3;
DisplayObject3D.ATTRIB_INDEX_TEXCOORDS = 4;
DisplayObject3D.ATTRIB_INDEX_COLOR     = 5;
DisplayObject3D.VERT_OFFSET_POSITION  = 0;
DisplayObject3D.VERT_OFFSET_NORMAL    = (3 * 4);
DisplayObject3D.VERT_OFFSET_TANGENT   = (3 * 4) + (3 * 4);
DisplayObject3D.VERT_OFFSET_BITANGENT = (3 * 4) + (3 * 4) + (3 * 4);
DisplayObject3D.VERT_OFFSET_TEXCOORDS = (3 * 4) + (3 * 4) + (3 * 4) + (3 * 4);
DisplayObject3D.VERT_OFFSET_COLOR     = (3 * 4) + (3 * 4) + (3 * 4) + (3 * 4) + (2 * 4);

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
	this.renderMat = mat4.create();
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

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);

	// vec3
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_POSITION);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_POSITION, 3,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_POSITION);

	// vec3
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_NORMAL);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_NORMAL, 3,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_NORMAL);

	// vec3
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_TANGENT);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_TANGENT, 3,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_TANGENT);

	// vec3
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_BITANGENT);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_BITANGENT, 3,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_BITANGENT);

	// vec2
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_TEXCOORDS);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_TEXCOORDS, 2,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_TEXCOORDS);

	// vec4
	gl.enableVertexAttribArray(DisplayObject3D.ATTRIB_INDEX_COLOR);
	gl.vertexAttribPointer(DisplayObject3D.ATTRIB_INDEX_COLOR, 4,
		gl.FLOAT, false, DisplayObject3D.VERTEX_SIZE_BYTES, DisplayObject3D.VERT_OFFSET_COLOR);


	this.material.apply(mat4.mul(this.renderMat, this.transform, camera.pvMatrix));

	//this.material.apply(camera.pvMatrix);

	if(!!this.texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);

	

	gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertexLength);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

};

module.exports = DisplayObject3D;
'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	glm = require('gl-matrix'),
	Tween = require('../../animation/tween/tween'),
	vec2 = glm.vec2,
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat,
	Cycle = require('../../animation/cycle'),
	Log = require('../../log');

const UP = vec3.fromValues(0, 1, 0);

function Camera(){
	
	SceneNode.prototype.constructor.call(this);

	this.up = UP;
	
	this._x = 0;
	this._y = 0;
	this._z = -3;
	
	this.position = new Float32Array(3);
	this.front = new Float32Array(3);
	this.projection = new Float32Array(16);
	this.view = new Float32Array(16);
	this.pvMatrix = new Float32Array(16);
	this.targetPosition = new Float32Array(3);
	this.scratchVec = new Float32Array(3);
	this.scratchVec2 = new Float32Array(3);
	this.scratchMat = new Float32Array(16);
	this.scratchQuat = new Float32Array(4);

	vec3.set(this.position, this._x, this._y, this._z);
	this.front = vec3.fromValues(0, 0, 0);
	
}

Camera.prototype = Object.create(SceneNode, {
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			mat4.perspective(this.projection, Math.PI / 180 * 45, this.viewport.width / this.viewport.height, .1, 1000);
			this.setView();
		},
		get: function() {
			return this._viewport;
		}
	},
	'x': {
		get: function() {
			return this._x;
		},
		set: function(x) {
			this.position[0] = x;
			this._x = x;
			this.setView();
		}
	},
	'y': {
		get: function() {
			return this._y;
		},
		set: function(y) {
			this.position[1] = y;
			this._y = y;
			this.setView();
		}
	},
	'z': {
		get: function() {
			return this._z;
		},
		set: function(z) {
			this.position[2] = z;
			this._z = z;
			this.setView();
		}
	},
	'rotationX': {
		get: function(){
			if(!!this._rotationX) {
				return this._rotationX;
			}
			return this._rotationX = 0;
		},
		set: function(rad){
			
			this._rotationX = rad;
			this.transformRotation();
		}
	},
	'rotationY': {
		get: function(){
			if(!!this._rotationY) {
				return this._rotationY;
			}
			return this._rotationY = 0;
		},
		set: function(rad){
			
			this._rotationY = rad;
			this.transformRotation();
		}
	},
	'rotationZ': {
		get: function(){
			if(!!this._rotationZ) {
				return this._rotationZ;
			}
			return this._rotationZ = 0;
		},
		set: function(rad){
			
			this._rotationZ = rad;
			this.transformRotation();
		}
	}
});
Camera.prototype.constructor = Camera;

Camera.prototype.follow = function(node) {
	this.followNode = node;
	this.cycleFollowMove = this.followMove.bind(this);
	Cycle.add(this.cycleFollowMove);
}

Camera.prototype.followMove = function() {

	mat4.getRotation(this.scratchQuat, this.followNode.transform);

	quat.normalize(this.scratchQuat, this.scratchQuat);

	mat4.getTranslation(this.front, this.followNode.transform);

	vec3.transformQuat(this.scratchVec, vec3.set(this.scratchVec, 0, 0, this.followDistance), this.scratchQuat);

	this.scratchVec[1] = 0;

	vec3.normalize(this.scratchVec, this.scratchVec);

	vec3.scale(this.scratchVec, this.scratchVec, this.followDistance);

	vec3.sub(this.targetPosition, this.front, this.scratchVec);

	let d = vec3.dist(this.targetPosition, this.position);

	if(d < this.followDistance * .1) {
		vec3.copy(this.position, this.targetPosition);		
	} else {
		vec3.sub(this.scratchVec, this.targetPosition, this.position);
		vec3.normalize(this.scratchVec, this.scratchVec);

		let d2 = d - this.followSpeed;

		if(d2 >= this.followDistance) {
			vec3.scale(this.scratchVec, this.scratchVec, this.followDistance);
		} else {
			vec3.scale(this.scratchVec, this.scratchVec, d2);
		}

		vec3.sub(this.position, this.targetPosition, this.scratchVec);

	}

	this.setView();
	
}

Camera.prototype.setView = function() {
	mat4.lookAt(this.view, this.position, this.front, this.up);
	mat4.mul(this.pvMatrix, this.projection, this.view);
}

Camera.prototype.project = function(v2d, v3d, m) {
	var ix = v3d[0]
	var iy = v3d[1]
	var iz = v3d[2]

	var ox = m[0] * ix + m[4] * iy + m[8] * iz + m[12]
	var oy = m[1] * ix + m[5] * iy + m[9] * iz + m[13]
	var ow = m[3] * ix + m[7] * iy + m[11] * iz + m[15]

	v2d[0] =     (ox / ow + 1) / 2;
	v2d[1] = 1 - (oy / ow + 1) / 2;
	
	return v2d
};

module.exports = Camera;
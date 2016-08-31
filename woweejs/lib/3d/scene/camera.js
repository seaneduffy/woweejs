'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	glm = require('gl-matrix'),
	Tween = require('../../animation/tween/tween'),
	vec2 = glm.vec2,
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat,
	Cycle = require('../../animation/cycle');

const UP = vec3.fromValues(0, 1, 0);
let LOG_CAMERA_POSITION_X = document.querySelector('#camera-position .x'),
	LOG_CAMERA_POSITION_Y = document.querySelector('#camera-position .y'),
	LOG_CAMERA_POSITION_Z = document.querySelector('#camera-position .z'),
	LOG_CAMERA_FRONT_X = document.querySelector('#camera-front .x'),
	LOG_CAMERA_FRONT_Y = document.querySelector('#camera-front .y'),
	LOG_CAMERA_FRONT_Z = document.querySelector('#camera-front .z');

function Camera(){
	
	SceneNode.prototype.constructor.call(this);

	this.up = UP;
	
	this._x = 3;
	this._y = 3;
	this._z = -3;
	
	this.position = new Float32Array(3);
	this.front = new Float32Array(3);
	this.projection = new Float32Array(16);
	this.view = new Float32Array(16);
	this.pvMatrix = new Float32Array(16);
	this.targetPosition = new Float32Array(3);
	this.scratchVec = new Float32Array(3);
	this.scratchMat = new Float32Array(16);
	this.scratchQuat = new Float32Array(4);

	vec3.set(this.position, this._x, this._y, this._z);
	this.front = vec3.fromValues(0, 0, 0);
	
}

Camera.prototype = Object.create(SceneNode, {
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			mat4.perspective(this.projection, Math.PI / 180 * 45, this.viewport.width / this.viewport.height, 1, 100);
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

Camera.prototype.follow = function(node, distance, marker) {
	this.followNode = node;
	this.followMarker = marker;
	this.followDistance = distance;
	this.cycleFollowMove = this.followMove.bind(this);
	Cycle.add(this.cycleFollowMove);
}

Camera.prototype.followMove = function() {
	mat4.getRotation(this.scratchQuat, this.followNode.transform);
	quat.normalize(this.scratchQuat, this.scratchQuat);
	mat4.getTranslation(this.front, this.followNode.transform);
	vec3.transformQuat(this.scratchVec, vec3.set(this.scratchVec, 0, 0, this.followDistance), this.scratchQuat);
	vec3.sub(this.targetPosition, this.front, this.scratchVec);
	vec3.copy(this.position, this.targetPosition);
	this.setView();
	/*let rotX = Math.acos(this.scratchQuat[1])*2;
	let rotY = Math.acos(this.scratchQuat[2])*2;
	let rotZ = Math.acos(this.scratchQuat[3])*2;
	Log.log('Camera rotation X', rotX * 180 / Math.PI);
	Log.log('Camera rotation Y', rotY * 180 / Math.PI);
	Log.log('Camera rotation Z', rotZ * 180 / Math.PI);
	
	mat4.copy(this.scratchMat, this.followNode.transform);
	mat4.getTranslation(this.front, this.scratchMat);
	mat4.getRotation(this.scratchQuat, this.scratchMat);
	vec3.transformQuat(this.scratchVec, vec3.set(this.scratchVec, 0, 0, 1), this.scratchQuat);
	vec3.sub(this.scratchVec, this.scratchVec, this.front);
	this.scratchVec[1] = this.front[1];
	vec3.normalize(this.scratchVec, this.scratchVec);
	vec3.scale(this.targetPosition, this.scratchVec, this.followDistance);
	vec3.copy(this.position, this.targetPosition);
	let distance = Math.abs(vec3.distance(this.position, this.targetPosition));
	if(distance <= .03) {
		vec3.copy(this.position, this.targetPosition);
		return;
	}
	vec3.sub(this.scratchVec, this.targetPosition, this.position);
	vec3.scale(this.scratchVec, this.scratchVec, .08);
	vec3.add(this.position, this.scratchVec, this.position);*/
	
	/*mat4.translate(this.scratchMat, this.scratchMat, vec3.set(this.scratchVec, 0, 0, -1));
	mat4.getTranslation(this.targetPosition, this.scratchMat);
	this.targetPosition[1] = 0;
	vec3.normalize(this.targetPosition, this.targetPosition);
	vec3.scale(this.targetPosition, this.targetPosition, this.followDistance);
	
	console.log(distance);
	mat4.getRotation(this.scratchQuat, this.scratchMat);
	vec3.set(this.scratchVec, 0,1,0);
	let rad = quat.getAxisAngle(this.scratchVec, this.scratchQuat);
	mat4.rotateY(this.scratchMat, this.scratchMat, -rad);
	
	this.targetPosition[1] = 0;
	vec3.copy(this.position, this.targetPosition);
	
	let distance = Math.abs(vec3.distance(this.position, this.targetPosition));

	mat4.translate(this.scratchMat, this.followNode.transform, [this.front[0], this.front[1], this.front[2]+1]);
	mat4.getTranslation(this.scratchVec, this.followNode.transform);
	mat4.getTranslation(this.up, this.scratchMat);
	vec3.cross(this.up, this.up, this.front);
	console.log(this.front, this.up);
	vec3.normalize(this.up, this.up);
	
	vec3.rotateX(this.up, UP, this.followNode.translationVec, this.followNode.rotationX);
	vec3.rotateY(this.up, UP, this.followNode.translationVec, this.followNode.rotationY);
	vec3.rotateZ(this.up, UP, this.followNode.translationVec, this.followNode.rotationZ);
	vec3.normalize(this.up, this.up);*/
	
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
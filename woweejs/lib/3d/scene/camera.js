'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	glm = require('gl-matrix'),
	Tween = require('../../animation/tween/tween'),
	vec2 = glm.vec2,
	vec3 = glm.vec3,
	mat4 = glm.mat4,
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
	this.scratchMat = new Float32Array(16);
	
	vec3.set(this.position, this._x, this._y, this._z);
	this.front = vec3.fromValues(this._x, this._y, this._z + 1);
	
}

Camera.prototype = Object.create(SceneNode, {
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
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

Camera.prototype.follow = function(node, distance) {
	this.followNode = node;
	this.followDistance = distance;
	this.cycleFollowMove = this.followMove.bind(this);
	Cycle.add(this.cycleFollowMove);
}

Camera.prototype.followMove = function() {
	mat4.copy(this.scratchMat, this.followNode.transform);
	mat4.getTranslation(this.front, this.scratchMat);
	mat4.translate(this.scratchMat, this.scratchMat, vec3.set(this.scratchVec, 0, 0, -this.followDistance));
	mat4.getTranslation(this.targetPosition, this.scratchMat);
	
	/*let distance = Math.abs(vec3.distance(this.position, this.targetPosition));
	if(distance <= .03) {
		vec3.set(this.position, this.targetPosition[0],this.targetPosition[1],this.targetPosition[2]);
		return;
	}
	vec3.sub(this.scratchVec, this.targetPosition, this.position);
	vec3.copy(this.position, this.targetPosition);
	//vec3.scale(this.scratchVec, this.scratchVec, .03);
	//vec3.add(this.position, this.scratchVec, this.position);*/
	this.position[1] = this.front[1];


	/*mat4.translate(this.scratchMat, this.followNode.transform, [this.front[0], this.front[1], this.front[2]+1]);
	mat4.getTranslation(this.scratchVec, this.followNode.transform);
	mat4.getTranslation(this.up, this.scratchMat);
	vec3.cross(this.up, this.up, this.front);
	console.log(this.front, this.up);
	vec3.normalize(this.up, this.up);
	
	vec3.rotateX(this.up, UP, this.followNode.translationVec, this.followNode.rotationX);
	vec3.rotateY(this.up, UP, this.followNode.translationVec, this.followNode.rotationY);
	vec3.rotateZ(this.up, UP, this.followNode.translationVec, this.followNode.rotationZ);
	vec3.normalize(this.up, this.up);*/
	this.setView();
}

Camera.prototype.setView = function() {
	LOG_CAMERA_POSITION_X.innerHTML = this.position[0];
	LOG_CAMERA_POSITION_Y.innerHTML = this.position[1];
	LOG_CAMERA_POSITION_Z.innerHTML = this.position[2];
	LOG_CAMERA_FRONT_X.innerHTML = this.front[0];
	LOG_CAMERA_FRONT_Y.innerHTML = this.front[1];
	LOG_CAMERA_FRONT_Z.innerHTML = this.front[2];
	mat4.perspective(this.projection, Math.PI / 180 * 30, this.viewport.width / this.viewport.height, 1, 100);
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

Camera.prototype.transformRotation = function() {
	vec3.normalize(
		this.front,
		vec3.set(
			this.front,
			Math.cos(this.rotationY) * Math.cos(this.rotationX), 
			Math.sin(this.rotationX), 
			Math.cos(this.rotationX) * Math.sin(this.rotationY)
		)
	);

	this.setView();
};

module.exports = Camera;
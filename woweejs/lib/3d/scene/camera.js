'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	vec2 = require('gl-matrix-vec2'),
	vec3 = require('gl-matrix-vec3'),
	mat4 = require('gl-matrix-mat4');

const UP = vec3.fromValues(0, 1, 0);
let LOG_CAMERA_POSITION_X = document.querySelector('#camera-position .x'),
	LOG_CAMERA_POSITION_Y = document.querySelector('#camera-position .y'),
	LOG_CAMERA_POSITION_Z = document.querySelector('#camera-position .z'),
	LOG_CAMERA_FRONT_X = document.querySelector('#camera-front .x'),
	LOG_CAMERA_FRONT_Y = document.querySelector('#camera-front .y'),
	LOG_CAMERA_FRONT_Z = document.querySelector('#camera-front .z');

function Camera(){
	LOG_CAMERA_POSITION_X = document.querySelector('#camera-position .x');
	LOG_CAMERA_POSITION_Y = document.querySelector('#camera-position .y');
	LOG_CAMERA_POSITION_Z = document.querySelector('#camera-position .z');
	LOG_CAMERA_FRONT_X = document.querySelector('#camera-front .x');
	LOG_CAMERA_FRONT_Y = document.querySelector('#camera-front .y');
	LOG_CAMERA_FRONT_Z = document.querySelector('#camera-front .z');
	
	SceneNode.prototype.constructor.call(this);
	vec3.set(this.front, 0, 0, -1);
	vec3.set(this.position, 0, 0, 3);
	mat4.perspective(this.frustum, 20, 1, 0.1, 100);
	this.setView();
}

Camera.prototype = Object.create(SceneNode, {
	'view': {
		get: function(){
			if(!!this._view) {
				return this._view;
			}
			return this._view = mat4.create();
		}
	},
	'frustum': {
		get: function(){
			if(!!this._frustum) {
				return this._frustum;
			}
			return this._frustum = mat4.create();
		}
	},
	'target': {
		get: function(){
			if(!!this._target) {
				return this._target;
			}
			return this._target = vec3.create();
		}
	},
	'front': {
		get: function(){
			if(!!this._front) {
				return this._front;
			}
			return this._front = vec3.create();
		}
	},
	'position': {
		get: function(){
			if(!!this._position) {
				return this._position;
			}
			return this._position = vec3.create();
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
			vec3.copy(this.target, this.position);
			let v1 = vec3.fromValues(0, Math.sin(rad), Math.cos(rad)),
				v2 = vec3.create();
			vec3.add(v2, this.target, v3);
			this.target = v2;
			this._rotationX = rad;
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
			vec3.copy(this.target, this.position);
			let v1 = vec3.fromValues(Math.cos(rad), Math.sin(rad), 0),
				v2 = vec3.create();
			vec3.add(v2, this.target, v3);
			this.target = v2;
			this._rotationZ = rad;
		}
	}
});

/****************************************

	Public methods

****************************************/

Camera.prototype.toDisplay = function(shape, transform) {
	return shape.map(function(vertex){
		return this.vec3toVec2(vertex, transform);
	}.bind(this));
};

Camera.prototype.vec3toVec2 = function(v3, local) {
	let out = vec3.create();
	vec3.transformMat4(out, v3, local);
	vec3.transformMat4(out, out, this.view);
	vec3.transformMat4(out, out, this.frustum);
	return out;
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
}

/****************************************

	Protected methods

****************************************/

Camera.prototype.setView = function() {
	LOG_CAMERA_POSITION_X.innerHTML = this.position[0];
	LOG_CAMERA_POSITION_Y.innerHTML = this.position[1];
	LOG_CAMERA_POSITION_Z.innerHTML = this.position[2];
	LOG_CAMERA_FRONT_X.innerHTML = this.front[0];
	LOG_CAMERA_FRONT_Y.innerHTML = this.front[1];
	LOG_CAMERA_FRONT_Z.innerHTML = this.front[2];
	mat4.lookAt(this.view, 
		this.position, 
		vec3.add(vec3.create(), this.position, this.front),
		UP);
};

module.exports = Camera;
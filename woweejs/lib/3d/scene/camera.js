'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	glm = require('gl-matrix'),
	vec2 = glm.vec2,
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	createOrbitCamera = require('orbit-camera');

const UP = vec3.fromValues(0, 1, 0);
let LOG_CAMERA_POSITION_X = document.querySelector('#camera-position .x'),
	LOG_CAMERA_POSITION_Y = document.querySelector('#camera-position .y'),
	LOG_CAMERA_POSITION_Z = document.querySelector('#camera-position .z'),
	LOG_CAMERA_FRONT_X = document.querySelector('#camera-front .x'),
	LOG_CAMERA_FRONT_Y = document.querySelector('#camera-front .y'),
	LOG_CAMERA_FRONT_Z = document.querySelector('#camera-front .z');

function Camera(){
	
	SceneNode.prototype.constructor.call(this);

	this.up = vec3.fromValues(0, 1, 0);
	vec3.set(this.position, 0, 0, 3);
	this.front = vec3.fromValues(0, 0, -1);
	this.projection = new Float32Array(16);
	this.view = new Float32Array(16);
	this.pvMatrix = new Float32Array(16);
	this.v2 = new Float32Array(2);
	
}

Camera.prototype = Object.create(SceneNode, {
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			mat4.perspective(this.projection, Math.PI / 4, viewport.width / viewport.height, 0.00001, 10000);
			this.setView();
		},
		get: function() {
			return this._viewport;
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

/****************************************

	Public methods

****************************************/

Camera.prototype.setView = function() {
	this.orbitCam = createOrbitCamera(this.position, this.front, this.up);
	this.orbitCam.view(this.view);
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


//UNDER CONSTRUCTION
Camera.prototype.unproject = function(v2d, v3d, m) {
	var ix = v3d[0]
	var iy = v3d[1]
	var iz = 0;

	var ox = m[0] * ix + m[4] * iy + m[8] * iz + m[12]
	var oy = m[1] * ix + m[5] * iy + m[9] * iz + m[13]
	var ow = m[3] * ix + m[7] * iy + m[11] * iz + m[15]

	//2 * v2d[0] - 1 = ox / ow;
		
	//oy / ow = 3 - 2 * v2d[1];
	
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

/****************************************

	Protected methods

****************************************/
/*
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
};*/

module.exports = Camera;
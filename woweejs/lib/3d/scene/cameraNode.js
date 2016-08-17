'use strict';

let SceneNode = require('./sceneNode'),
	Camera = require('../camera'),
	geom = require('../../geom'),
	vec3 = require('gl-matrix-vec3'),
	cameras = [];

function CameraNode(){
	SceneNode.prototype.constructor.call(this);
	cameras.push(new Camera());
	this._cameraIndex = cameras.length - 1;
}

CameraNode.prototype = Object.create(SceneNode, {
	'rotationX': {
		get: function(){
			if(!!this._rotationX) {
				return this._rotationX;
			}
			return this._rotationX = 0;
		},
		set: function(rad){
			let c = cameras[this._cameraIndex],
				nt = vec3.create();
			vec3.rotateX(nt, c.target, c.position, rad);
			c.target = nt;
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
			let c = cameras[this._cameraIndex],
				nt = vec3.create();
			vec3.rotateY(nt, c.target, c.position, rad);
			c.target = nt;
			this._rotationY = rad;
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
			let c = cameras[this._cameraIndex],
				nt = vec3.create();
			vec3.rotateZ(nt, c.target, c.position, rad);
			c.target = nt;
			this._rotationZ = rad;
		}
	}
});

CameraNode.prototype.toDisplay = function(shape, transform) {
	return shape.map(function(vertex){
		return cameras[this._cameraIndex].vec3toVec2(vertex, transform);
	}.bind(this));
};

module.exports = CameraNode;
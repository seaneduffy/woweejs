'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat;

function SceneNode() {
	this.origin = vec3.create();
	this.rotationQuat = quat.create();
	this.scaleVec = vec3.create();
	this.scratch = mat4.create();
	this.translationVec = vec3.create();
}

Object.defineProperties(SceneNode.prototype, {

	'rotationX': {
		get: function(){
			if(!!this._rotationX) {
				return this._rotationX;
			}
			return this._rotationX = 0;
		},
		set: function(rad){
			this._rotationX = rad;
			this.updateTransform();
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
			this.updateTransform();
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
			this.updateTransform();
		}
	},
	'x': {
		get: function(){
			if(!!this._x) {
				return this._x;
			}
			return this._x = 0;
		},
		set: function(x){
			this._x = x;
			this.updateTransform();
		}
	},
	'y': {
		get: function(){
			if(!!this._y) {
				return this._y;
			}
			return this._y = 0;
		},
		set: function(y){
			this._y = y;
			this.updateTransform();
		}
	},
	'z': {
		get: function(){
			if(!!this._z) {
				return this._z;
			}
			return this._z = 0;
		},
		set: function(z){
			this._z = z;
			this.updateTransform();
		}
	},
	'scale': {
		get: function(){
			if(!!this._scale) {
				return this._scale;
			}
			return this._scale = 1;
		},
		set: function(scale) {
			this._scale = scale;
			this.updateTransform();
		}
	},
	'children': {
		get: function() {
			if(!!this._children) {
				return this._children;
			}
			return this._children = [];
		},
		set: function(arr) {
			this._children = arr;
		}
	},
	'parent': {
		get: function(){
			return this._parent;
		},
		set: function(sceneNode){
			this._parent = sceneNode;
		}
	},
	'transform': {
		get: function(){
			if(!!this._transform) {
				return this._transform;
			}
			return this._transform = mat4.create();
		},
		set: function(transform){
			this._transform = transform;
		}
	},
	'origin': {
		get: function(){
			if(!!this._origin) {
				return this._origin;
			}
			return this._origin = vec3.create();
		},
		set: function(v){
			this._origin = v;
		}
	}
});

SceneNode.prototype.updateTransform = function() {

	if(!!this.parent) {
		mat4.fromRotationTranslationScaleOrigin(
			this.scratch, 
			this.parent.rotationQuat, 
			this.parent.translationVec, 
			vec3.set(this.parent.scaleVec, this.parent.scale, this.parent.scale, this.parent.scale),
			this.parent.translationVec
		);
	}
	
	quat.identity(this.rotationQuat);
	quat.rotateX( this.rotationQuat, this.rotationQuat, this.rotationX );
	quat.rotateY( this.rotationQuat, this.rotationQuat, this.rotationY );
	quat.rotateZ( this.rotationQuat, this.rotationQuat, this.rotationZ );
	mat4.fromRotationTranslationScale(
		this.transform, 
		this.rotationQuat, 
		vec3.set(this.translationVec, this.x, this.y, this.z), 
		vec3.set(this.scaleVec, this.scale, this.scale, this.scale)
	);

	mat4.mul(this.transform, this.scratch, this.transform);

	this.children.forEach( child=>{
		child.updateTransform();
	});
	
};

SceneNode.prototype.addChild = function(sceneNode){
	sceneNode.parent = this;
	this.children.push(sceneNode);
};

module.exports = SceneNode;
'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	mat4 = glm.mat4;

function SceneNode() {
	
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
			this.position = vec3.fromValues(x, this.y, this.z);
			this._x = x;
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
			this.position = vec3.fromValues(this.x, y, this.z);
			this._y = y;
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
			this.position = vec3.fromValues(this.x, this.y, z);
			this._z = z;
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
	'position': {
		get: function(){
			if(!!this._position) {
				return this._position;
			}
			return this._position = vec3.create();
		},
		set: function(p){
			
			this._position = p;
			this._x = p[0];
			this._y = p[1];
			this._z = p[2];
			
			this.updateTransform();
			
		}
	},
	'parentTransform': {
		get: function(){
			if(!!this._parentTransform) {
				return this._parentTransform;
			}
		},
		set: function(t){
			this._parentTransform = t;
			this.updateTransform();
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
	}
});

SceneNode.prototype.updateTransform = function() {
	mat4.identity(this.transform);
	mat4.translate(this.transform, this.transform, this.position);
	mat4.rotateX(this.transform, this.transform, this.rotationX);
	mat4.rotateY(this.transform, this.transform, this.rotationY);
	mat4.rotateZ(this.transform, this.transform, this.rotationZ);
	mat4.scale(this.transform, this.transform, vec3.fromValues(this.scale, this.scale, this.scale));
	mat4.mul(this.transform, this.transform, this.parentTransform);
	
	this.children.forEach(child=>{
		child.parentTransform = this.transform;
	});
};

SceneNode.prototype.setPosition = function(x, y, z){
	vec3.set(this.position, x, y, z);
};

SceneNode.prototype.addChild = function(sceneNode){
	this.children.push(sceneNode);
};

module.exports = SceneNode;
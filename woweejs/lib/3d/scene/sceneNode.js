'use strict';

let vec3 = require('gl-matrix-vec3'),
	mat4 = require('gl-matrix-mat4');

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
			mat4.rotateX(this.transform, this.transform, -this._rotationX);
			mat4.rotateX(this.transform, this.transform, rad);
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
			mat4.rotateY(this.transform, this.transform, -this._rotationY);
			mat4.rotateY(this.transform, this.transform, rad);
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
			mat4.rotateZ(this.transform, this.transform, -this._rotationZ);
			mat4.rotateZ(this.transform, this.transform, rad);
			this._rotationZ = rad;
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
		}
	},
	'transform': {
		get: function(){
			if(!!this._transform) {
				return this._transform;
			}
			return this._transform = mat4.create();
		},
		set: function(t){
			this._transform = t;
		}
	}
});

SceneNode.prototype.setPosition = function(x, y, z){
	this._position = vec3.fromValues(x, y, z);
};

SceneNode.prototype.addChild = function(sceneNode){
	this.children.push(sceneNode);
};

module.exports = SceneNode;
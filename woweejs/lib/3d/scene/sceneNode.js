'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat;

function SceneNode() {
	this.origin = vec3.create();
	this.rotationQuat = quat.create();
	this.rotationMat = mat4.create();
	this.scaleVec = vec3.create();
	this.translationVec = vec3.create();
	this.localTransform = mat4.create();
	this.worldTransform = mat4.create();
	this.transform = mat4.create();
	this.mat4Identity = mat4.create();
	this.vec3Identity = vec3.create();
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
			mat4.rotateX(this.localTransform, this.localTransform, rad - this.rotationX);
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
			mat4.rotateY(this.localTransform, this.localTransform, rad - this.rotationY);
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
			mat4.rotateZ(this.localTransform, this.localTransform, rad - this.rotationZ);
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
			mat4.translate(this.localTransform, this.localTransform, vec3.fromValues(x - this.x, 0, 0));
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
			mat4.translate(this.localTransform, this.localTransform, vec3.fromValues(0, y - this.y, 0));
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
			mat4.translate(this.localTransform, this.localTransform, vec3.fromValues(0, 0, z - this.z));
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
			scale = scale / this.scale;
			mat4.scale(this.localTransform, this.localTransform, vec3.set(this.scaleVec, scale, scale, scale));
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

SceneNode.prototype.updateWorldTransform = function(t) {
	
	this.worldTransform = t;
	this.updateTransform();
	
};

SceneNode.prototype.updateTransform = function() {
	
	mat4.mul(this.transform, this.worldTransform, this.localTransform);
	/*console.log(this.id, 'localTransform', this.localTransform);
	console.log(this.id, 'worldTransform', this.worldTransform);
	console.log(this.id, 'transform', this.transform);*/
	this.children.forEach( child=>{
		child.updateWorldTransform(this.transform);
	});
}

SceneNode.prototype.addChild = function(sceneNode){
	sceneNode.parent = this;
	this.children.push(sceneNode);
};

module.exports = SceneNode;
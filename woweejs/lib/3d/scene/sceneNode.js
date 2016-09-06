'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat,
	Cycle = require('../../animation/cycle'),
	Log = require('../../log');

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
	this.scratchQuat = quat.create();
	
	this.listeners = {
		'transform': []
	};
	
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
			/*if(Math.abs(rad) >= Math.PI * 2) {
				rad = rad % (Math.PI * 2);
			}
			if(rad <= 0) {
				rad = Math.PI * 2 + rad;
			}*/
			//mat4.getRotation(this.rotationQuat, this.localTransform);
			//quat.rotateX(this.rotationQuat, this.rotationQuat, rad - this.rotationX);
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
			/*if(Math.abs(rad) >= Math.PI * 2) {
				rad = rad % (Math.PI * 2);
			}
			if(rad <= 0) {
				rad = Math.PI * 2 + rad;
			}*/
			//mat4.getRotation(this.rotationQuat, this.localTransform);
			//quat.rotateY(this.rotationQuat, this.rotationQuat, rad - this.rotationY);
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
			/*if(Math.abs(rad) >= Math.PI * 2) {
				rad = rad % (Math.PI * 2);
			}
			if(rad <= 0) {
				rad = Math.PI * 2 + rad;
			}*/
			this._rotationZ = rad;
			//mat4.getRotation(this.rotationQuat, this.localTransform);
			//quat.rotateZ(this.rotationQuat, this.rotationQuat, rad - this.rotationZ);
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
			mat4.getTranslation(this.translationVec, this.localTransform);
			this.translationVec[0] = x;
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
			mat4.getTranslation(this.translationVec, this.localTransform);
			this.translationVec[1] = y;
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
			mat4.getTranslation(this.translationVec, this.localTransform);
			this.translationVec[2] = z;
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

SceneNode.prototype.rotateX = function(rad) {
	quat.rotateX(this.rotationQuat, this.rotationQuat, rad);
	this.updateTransform();
};

SceneNode.prototype.rotateY = function(rad) {
	quat.rotateY(this.rotationQuat, this.rotationQuat, rad);
	this.updateTransform();
};

SceneNode.prototype.rotateZ = function(rad) {
	quat.rotateZ(this.rotationQuat, this.rotationQuat, rad);
	this.updateTransform();
};

SceneNode.prototype.on = function(event, cb) {
	this.listeners[event].push(cb);
};

SceneNode.prototype.updateWorldTransform = function(t) {
	
	this.worldTransform = t;
	this.updateTransform();
	
};
var c = 0;
SceneNode.prototype.updateTransform = function() {
	/*Log.log('local x ', this.translationVec[0]);
	Log.log('local y ', this.translationVec[1]);
	Log.log('local z ', this.translationVec[2]);*/
	
	mat4.fromRotationTranslation(this.localTransform, this.rotationQuat, this.translationVec);
	mat4.mul(this.transform, this.worldTransform, this.localTransform);
	this.children.forEach( child=>{
		child.updateWorldTransform(this.transform);
	});
	this.listeners.transform.forEach( func => {
		func(this);
	});
}

SceneNode.prototype.addChild = function(sceneNode){
	sceneNode.parent = this;
	this.children.push(sceneNode);
};

module.exports = SceneNode;
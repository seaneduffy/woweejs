'use strict';

let SceneNode = require('./sceneNode'),
	vec3 = require('gl-matrix-vec3'),
	mat4 = require('gl-matrix-mat4'),
	
	UP = vec3.fromValues(0, 1, 0);
	
function createView() {
	this.right = this.right || vec3.create();
	vec3.cross(this.right, UP, this.direction);
	vec3.normalize(this.right, this.right);
	this.up = this.up || vec3.create();
	vec3.cross(this.up, this.direction, this.right);
	this.view = this.view || mat4.create();
	mat4.lookAt(this.view, this.position, this.target, UP);
}

function createDirection() {
	this.direction = this.direction || vec3.create();
	vec3.subtract(this.direction, this.target, this.position);
	vec3.normalize(this.direction, this.direction);
}

function Camera() {
	SceneNode.prototype.constructor.call(this);
	this.setPosition(0, 0, 3);
	this.target = vec3.fromValues(0, 0, 0);
}

Camera.prototype = Object.create(SceneNode.prototype, {
	'direction': {
		get: function() {
			return this._direction;
		},
		set: function(d) {
			this._direction = d;
			createView.call(this);
		}
	},
	'up': {
		get: function() {
			return this._up;
		},
		set: function(u) {
			this._up = u;
		}
	},
	'right': {
		get: function() {
			return this._right;
		},
		set: function(r) {
			this._right = r;
		}
	},
	'view': {
		get: function() {
			return this._view;
		},
		set: function(v) {
			this._view = v;
		}
	},
	'target': {
		get: function() {
			return this._target;
		},
		set: function(t) {
			this._target = t;
			if(!!this.position) {
				createDirection.call(this);
			}
		}
	},
	'position': {
		get: function() {
			return Object.getOwnPropertyDescriptor(SceneNode.prototype, 'position').get.call(this);
		},
		set: function(p) {
			Object.getOwnPropertyDescriptor(SceneNode.prototype, 'position').set.call(this, p);
			if(!!this.target) {
				createDirection.call(this);
			}
		}
	}
});

module.exports = Camera;
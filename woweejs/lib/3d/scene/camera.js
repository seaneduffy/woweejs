'use strict';

let SceneNode = require('./sceneNode'),
	vec3 = require('gl-matrix-vec3'),
	
	up = vec3.fromValues(0, 1, 0);

function Camera() {
	SceneNode.prototype.constructor.call(this);
	this.setPosition(0, 0, 3);
	this.target = vec3.fromValues(0, 0, 0);
}

Camera.prototype = Object.create(SceneNode.prototype, {
	'direction': {
		get: function() {
			return this._direction || new vec3();
		},
		set: function(d) {
			this._direction = d;
			vec3.cross(this.right, up, d);
			vec3.normalize(this.right);
			vec3.cross(this.up, d, this.right);
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
			return this._right || new vec3();
		},
		set: function(r) {
			this._right = r;
		}
	}
	'target': {
		get: function() {
			return this._target || new vec3();
		},
		set: function(t) {
			this._target = t;
			vec3.subtract(this.direction, t, this.position);
			vec3.normalize(this.direction);
		}
	}
});

module.exports = Camera;
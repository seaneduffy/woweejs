'use strict';

let vec2 = require('gl-matrix-vec2'),
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
	this.position = vec3.fromValues(0, 0, 3);
	this.target = vec3.fromValues(0, 0, 0);
	this.createFrustum( 10, 1, 5, 100);
}

Object.defineProperties(Camera.prototype, {
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
			return this._position;
		},
		set: function(p) {
			this._position = p;
			if(!!this.target) {
				createDirection.call(this);
			}
		}
	},
	'createFrustum': {
		value: function(fov, aspectRatio, near, far) {
			this.frustum = this.frustum || mat4.create();
			mat4.perspective(fov, aspectRatio, near, far);
		}
	},
	'frustum': {
		get: function() {
			return this._frustum;
		},
		set: function(f) {
			this._frustum = f;
		}
	},
	'vec3toVec2': {
		value: function(v3, local) {
			console.log(v3, local);
			let out = vec3.create();
			vec3.transformMat4(out, v3, local);
			vec3.transformMat4(out, out, this.view);
			vec3.transformMat4(out, out, this.frustum);
			return out;
		}
	}
});

module.exports = Camera;
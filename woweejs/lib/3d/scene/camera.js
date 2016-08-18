'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	vec2 = require('gl-matrix-vec2'),
	vec3 = require('gl-matrix-vec3'),
	mat4 = require('gl-matrix-mat4');

const UP = vec3.fromValues(0, 1, 0);

function Camera(){
	SceneNode.prototype.constructor.call(this);

	this.position = vec3.fromValues(0, 0, 1);
	this.target = vec3.fromValues(0, 0, 0);
	this.createDirection();
	this.createView();
	this.createFrustum( 1, 1, 50, 500);
}

Camera.prototype = Object.create(SceneNode, {
	/*'direction': {
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
	'frustum': {
		get: function() {
			return this._frustum;
		},
		set: function(f) {
			this._frustum = f;
		}
	},*/
	'rotationX': {
		get: function(){
			if(!!this._rotationX) {
				return this._rotationX;
			}
			return this._rotationX = 0;
		},
		set: function(rad){
			vec3.copy(this.target, this.position);
			let v1 = vec3.fromValues(0, Math.sin(rad), Math.cos(rad)),
				v2 = vec3.create();
			vec3.add(v2, this.target, v3);
			this.target = v2;
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

			this._rotationY = rad;

			console.log('position',this.position);
			console.log('target', this.target);
			console.log('target change',vec3.fromValues(Math.cos(rad), 0, Math.cos(rad)));

			console.log(Math.sin(Math.PI));

			vec3.sub(
				this.target, 
				this.position, 
				vec3.fromValues(Math.cos(rad), 0, Math.cos(rad))
			);

			mat4.lookAt(this.view, this.position, this.target, UP);
			console.log('new target', this.target);
			/*let tmpRad = -rad + Math.PI / 2,
				v1 = vec3.copy(vec3.create(), this.direction),
				v2 = vec3.create(),
				v3 = vec3.fromValues(Math.cos(tmpRad), 1, Math.sin(tmpRad));
			vec3.sub(v2, v1, v3);
			this.target = v2;
			console.log('curr direction', v1);
			console.log('new direction', v3);
			console.log('new target', v2);
			this._rotationY = rad;*/
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
			vec3.copy(this.target, this.position);
			let v1 = vec3.fromValues(Math.cos(rad), Math.sin(rad), 0),
				v2 = vec3.create();
			vec3.add(v2, this.target, v3);
			this.target = v2;
			this._rotationZ = rad;
		}
	}
});

/****************************************

	Public methods

****************************************/

Camera.prototype.toDisplay = function(shape, transform) {
	return shape.map(function(vertex){
		return this.vec3toVec2(vertex, transform);
	}.bind(this));
};

Camera.prototype.vec3toVec2 = function(v3, local) {
	let out = vec3.create();
	vec3.transformMat4(out, v3, local);
	vec3.transformMat4(out, out, this.view);
	vec3.transformMat4(out, out, this.frustum);

	return out;
};

/****************************************

	Protected methods

****************************************/

Camera.prototype.createFrustum = function(fov, aspectRatio, near, far) {
	this.frustum = this.frustum || mat4.create();
	mat4.perspective(fov, aspectRatio, near, far);
};

Camera.prototype.createView = function() {
	this.right = this.right || vec3.create();
	vec3.cross(this.right, UP, this.direction);
	vec3.normalize(this.right, this.right);
	this.up = this.up || vec3.create();
	vec3.cross(this.up, this.direction, this.right);
	this.view = this.view || mat4.create();
	mat4.lookAt(this.view, this.position, this.target, UP);
};

Camera.prototype.createDirection = function() {
	let v3 = vec3.create();
	vec3.subtract(v3, this.target, this.position);
	vec3.normalize(v3, v3);
	this.direction = v3;
};

module.exports = Camera;
'use strict';

let DisplayObject = require('./display/displayObject');

function Camera() {
	DisplayObject.prototype.constructor.call(this);
}

Camera.prototype = Object.create(DisplayObject.prototype, {
	'focalLength': {
		get: function() {
			return this._focalLength;
		},
		set: function(focalLength) {
			this._focalLength = focalLength;
			if(!!this.rotationX && !!this.rotationY) {
				
			}
		}
	},
	'direction': {
		get: function() {
			return this._direction;
		},
		set: function(direction) {
			this._direction = direction;
		}
	},
	'rotationX': {
		get: function() {
			
		},
		set: function(rotX) {
			this._rotationX = rotX;
			if(!!this.rotationY && !!this.focalLength) {
				
			}
		}
	},
	'rotationY': {
		get: function() {

		},
		set: function(rotY) {
			this._rotationY = rotY;
			if(!!this.rotationX && !!this.focalLength) {

			}
		}
	},
	'convertPoint3D': {
		value: function(point3D){

		}
	}
});

module.exports = Camera;
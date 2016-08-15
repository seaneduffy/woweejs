'use strict';

function Point3D(x, y, z) {
	this._x = x;
	this._y = y;
	this._z = z;
}

Object.defineProperties(Point3D.prototype, {
	'x': {
		get: function() {
			return this._x;
		},
		set: function(x) {
			this._x = x;
		}
	},
	'y': {
		get: function() {
			return this._y;
		},
		set: function(y) {
			this._y = y;
		}
	},
	'z': {
		get: function() {
			return this._z;
		},
		set: function(z) {
			this._z = z;
		}
	}
});

module.exports = Point3D;
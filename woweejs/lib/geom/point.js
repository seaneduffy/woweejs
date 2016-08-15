'use strict';

function Point(x, y) {
	this._x = x;
	this._y = y;
}

Object.defineProperties(Point.prototype, {
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
	}
});

module.exports = Point;
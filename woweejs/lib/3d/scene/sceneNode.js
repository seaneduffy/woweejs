'use strict';

let vec3 = require('gl-matrix-vec3'),
	mat4 = require('gl-matrix-mat4');

function SceneNode() {
}

Object.defineProperties(SceneNode.prototype, {
	'position': {
		get: function(){
			return this._position || new vec3();
		},
		set: function(p){
			this._position = p;
		}
	},
	'setPosition': {
		value: function(x, y, z){
			this._position = vec3.fromValues(x, y, z);
		}
	}
	'transform': {
		get: function(){
			return this._transform || new mat4();
		},
		set: function(t){
			this._transform = t;
		}
	}
});

module.exports = SceneNode;
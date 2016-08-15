'use strict';

function DisplayObject() {
	this._node = null;
}

Object.defineProperties(DisplayObject.prototype, {
	'x': {
		get: function(){
			if(!!this._x)
				return this._x;
			return this.x = 0;
		},
		set: function(a){
			this._x = a;
		}
	},
	'y': {
		get: function(){
			if(!!this._y)
				return this._y;
			return this.y = 0;
		},
		set: function(a){
			this._y = a;
		}
	},
	'z': {
		get: function(){
			if(!!this._z)
				return this._z;
			return this.z = 0;
		},
		set: function(a){
			this._z = a;
		}
	},
	'addChild': {
		value:function(a){
			if(!!this._node) {
				this._node.appendChild(a.node);
				a.parent = this;
			}
		}
	},
	'node': {
		get: function() {
			return this._node;
		}
	},
	'parent': {
		set: function(a){
			this._parent = a;
		},
		get: function(){
			return this._parent;
		}
	}
});

module.exports = DisplayObject;
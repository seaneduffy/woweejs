'use strict';

let Graphics = require('./graphics'),
	DisplayObject = require('./displayObject'),
	sprites = [],
	availableSprites = Object.create(null);

function Sprite() {
	DisplayObject.prototype.constructor.call(this);
	sprites.push(this);
	this._graphics = new Graphics();
}

Sprite.prototype = Object.create(DisplayObject.prototype, {
	'x': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').get.call(this);
		},
		set: function(a){
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, a);
			this._graphics.setXPosition(a);
		}
	},
	'y': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').get.call(this);
		},
		set: function(a){
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, a);
			this._graphics.setYPosition(a);
		}
	},
	'z': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'z').get.call(this);
		},
		set: function(a){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'z').set.call(this, a);
			this._graphics.setZPosition(a);
		}
	},
	'node': {
		get: function() {
			return this._graphics.node;
		}
	},
	'graphics': {
		get: function() {
			return this._graphics;
		}
	}
});

module.exports = Sprite;
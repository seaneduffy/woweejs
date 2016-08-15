'use strict';

let DisplayObject = require('./displayObject');

function Graphics() {
	DisplayObject.prototype.constructor.call(this);
	this._node = this._canvas = document.createElement('canvas');
	this._canvas.style.zIndex = 0;
	this._canvas.style.position = 'absolute';
	this._canvas.style.transform = 'translate(0, 0)';
	this._context = this._canvas.getContext('2d');
}

Graphics.prototype = Object.create(DisplayObject.prototype, {
	'setXPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			//console.log(t);
			t = t.replace(/translateX(.+)/, '') + ' translateX(' + a + 'px)';
			//console.log(t);
			this._canvas.style.transform = t.trim();
		}
	},
	'setYPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			t = t.replace(/translateY(.+)/, '') + ' translateY(' + a + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'setZPosition': {
		value: function(a) {
			this._canvas.style.zIndex = z;
		}
	},
	'setWidth': {
		value: function(a) {
			this._canvas.setAttribute('width', a + 'px');
		}
	},
	'setHeight': {
		value: function(a) {
			this._canvas.setAttribute('height', a + 'px');
		}
	},
	'drawImage': {
		value: function(a) {
			this._canvas.width = a.width + 'px';
			this._canvas.height = a.height + 'px';
			this._context.clearRect(0, 0, this.width, this.height);
			this._context.drawImage(
				a, 
				0, 
				0, 
				this._canvas.width, 
				this._canvas.height,
				0,
				0, 
				this._canvas.width, 
				this._canvas.height);
		}
	},
	'fillStyle': {
		set: function(a) {
			this._context.fillStyle = a;
		}
	},
	'drawRect': {
		value: function(a, b, c, d) {
			this._context.fillRect(a, b, c, d);
		}
	}
});

module.exports = Graphics;
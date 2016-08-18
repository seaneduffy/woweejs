'use strict';

let root = null,
	defaultWidth = null,
	defaultHeight = null;

Graphics.setRoot = function(node){
	root = node;
};

Graphics.setDefaultWidth = function(width){
	defaultWidth = width;
}

Graphics.setDefaultHeight = function(height){
	defaultHeight = height;
};


function Graphics() {
	this._canvas = document.createElement('canvas');
	this._canvas.style.zIndex = 0;
	this._canvas.style.position = 'absolute';
	this._canvas.style.transform = 'translate(0, 0)';
	this._context = this._canvas.getContext('2d');
	this.width = defaultWidth;
	this.halfWidth = this.width / 2;
	this.height = defaultHeight;
	this.halfHeight = this.height / 2;
	root.appendChild(this._canvas);
}

Object.defineProperties(Graphics.prototype, {
	'x': {
		get: function(){
			return this._x;
		},
		set: function(x) {
			this._x = x;
			let t = this._canvas.style.transform;
			t = t.replace(/translateX(.+)/, '') + ' translateX(' + x + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'y': {
		get: function(){
			return this._y;
		},
		set: function(y) {
			this._y = y;
			let t = this._canvas.style.transform;
			t = t.replace(/translateY(.+)/, '') + ' translateY(' + y + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'z': {
		get: function(){
			return this._z;
		},
		set: function(z) {
			this._z = z;
			this._canvas.style.zIndex = z;
		}
	},
	'width': {
		get: function() {
			return this._width;
		},
		set: function(width) {
			this._width = width;
			this._canvas.setAttribute('width', width + 'px');
			this.halfWidth = this.width / 2;
		}
	},
	'height': {
		get: function() {
			return this._height;
		},
		set: function(height) {
			this._height = height;
			this._canvas.setAttribute('height', height + 'px');
			this.halfHeight = this.height / 2;
		}
	},
	'drawImage': {
		value: function(a) {
			this.width = a.width + 'px';
			this.height = a.height + 'px';
			this._context.clearRect(0, 0, this.width, this.height);
			this._context.drawImage(
				a, 
				0, 
				0, 
				this.width, 
				this.height,
				0,
				0, 
				this.width, 
				this.height);
		}
	},
	'fill': {
		set: function(a) {
			this._context.fillStyle = a;
		}
	},
	'draw': {
		value: function(vertices) {
			this._context.clearRect(0, 0, this.width, this.height);
			this._context.beginPath();
			vertices.forEach(function(vertex, index){
				if(index === 0) {
					this._context.moveTo(vertex[0] + this.halfWidth, vertex[1] + this.halfHeight);
				} else {
					this._context.lineTo(vertex[0] + this.halfWidth, vertex[1] + this.halfHeight);
				}
			}.bind(this));
			this._context.lineTo(vertices[0][0] + this.halfWidth, vertices[0][1] + this.halfHeight);
			this._context.closePath();
			this._context.fill();
		}
	},
	'drawRect': {
		value: function(a, b, c, d) {
			this._context.fillRect(a, b, c, d);
		}
	}
});

module.exports = Graphics;
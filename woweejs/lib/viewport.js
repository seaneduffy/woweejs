'use strict';

let DisplayObject = require('./display/sprite');

function Viewport(root, width, height, background) {
	DisplayObject.prototype.constructor.call(this);
	
	this._node = root;
	root.style.width = width;
	root.style.height = height;
	root.style.background = background;
}

Viewport.prototype = Object.create(DisplayObject.prototype);

module.exports = Viewport;
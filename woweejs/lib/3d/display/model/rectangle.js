'use strict';

let vec3 = require('gl-matrix-vec3');

function Rectangle(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4){
	Array.prototype.constructor.call(this);
	this.push(vec3.fromValues(x1, y1, z1)); 
	this.push(vec3.fromValues(x2, y2, z2));
	this.push(vec3.fromValues(x3, y3, z3));
	this.push(vec3.fromValues(x4, y4, z4));
}

Rectangle.prototype = Object.create(Array.prototype);

module.exports = Rectangle;
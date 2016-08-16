let vec3 = require('gl-matrix-vec3');

function Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3){
	Array.prototype.constructor.call(this);
	this.push(vec3.fromValues(x1, y1, z1)); 
	this.push(vec3.fromValues(x2, y2, z2));
	this.push(vec3.fromValues(x3, y3, z3));
}

Triangle.prototype = Object.create(Array.prototype);

module.exports = Triangle;
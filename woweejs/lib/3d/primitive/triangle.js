let vec3 = require('gl-matrix-vec3');

function Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3){
	this.vertices = [
		vec3.fromValues(x1, y1, z1), 
		vec3.fromValues(x2, y2, z2),
		vec3.fromValues(x3, y3, z3)
	];
}

module.exports = Triangle;
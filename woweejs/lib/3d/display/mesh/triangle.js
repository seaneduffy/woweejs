'use strict';

let vec3 = require('gl-matrix-vec3');

function Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3){
	Array.prototype.constructor.call(this);
	var ver = vec3.create(),
		expectedArgumentLength = 9;
	
	if(arguments.length < expectedArgumentLength) {
		while(expectedArgumentLength > 0) {
			Array.prototype.push.call(arguments, 0);
			expectedArgumentLength--;
		}
	}
	Array.prototype.forEach.call(arguments, function(arg, index){
		var c = index % 3;
		if(c === 0) {
			
			this.push(ver);
			ver = vec3.create();
		}
		ver[c] = 0;
	}.bind(this));
}

Triangle.prototype = Object.create(Array.prototype);

module.exports = Triangle;
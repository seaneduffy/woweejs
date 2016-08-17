'use strict';

module.exports = {
	degToRad: function(deg) {
		return Math.PI / 180 * deg;
	},
	radToDeg: function(rad) {
		return 180 / Math.PI * rad;
	},
	normalizeAngle: function(rad) {
		let n = rad % (Math.PI * 2);
		return n < 0 ? Math.PI * 2 + n : n;
	},
	angleDifference: function(rad1, rad2, direction) {
		
		let diff = rad2 - rad1;
		
		if(direction !== '+' && direction !== '-') {
			direction = (diff > 0 && diff <= Math.PI) 
				|| (diff < 0 && diff >= -Math.PI) ? '+' : '-';
		}
		
		return direction === '+' ? diff : rad1 - rad2;
	}
}
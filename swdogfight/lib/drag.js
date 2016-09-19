'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,

	Log = wowee.Log,
	Cycle = wowee.Cycle;

function Drag(amount) {

	this.objects = [];
	this.dragVec = vec3.create();
	this.origin = vec3.create();
	this.amount = amount;
	this.cycleDragObjects = this.dragObjects.bind(this);
	Cycle.add(this.cycleDragObjects);
}

Drag.prototype = {};

Drag.prototype.add = function(do3d) {
	this.objects.push(do3d);
};

Drag.prototype.dragObjects = function() {

	this.objects.forEach( do3d => {
		
		let speed = Math.abs(vec3.distance( do3d.velocity, this.origin ));
		if(speed === 0) {
			return;
		}
		speed = this.amount > speed ? 0 : speed - this.amount;
		vec3.normalize( do3d.velocity, do3d.velocity );
		Log.log('speed ', speed);
		vec3.scale( do3d.velocity, do3d.velocity, speed );

	} );
};

module.exports = Drag;
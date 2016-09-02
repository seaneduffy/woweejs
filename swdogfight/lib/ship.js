'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4;

function Ship() {
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = 0;
	this.topSpeed = .05;
	this.turnSpeed = Math.PI / 180 * 5;
	this.barrelSpeed = Math.PI / 180;
	this.scratchVec = vec3.create();
	this.scratchVec2 = vec3.create();
	this.scratchQuat = quat.create();
	this.velocity = vec3.create();

	this.cycleMove = this.move.bind(this);
	
	Cycle.add(this.cycleMove);
}

Ship.prototype.recenterPitch = function(){
	let rad = this.displayObject.rotationQuat[3] * 2;
	if(Math.abs(rad) <= this.turnSpeed) {
		this.displayObject.drx = 0;
		Cycle.remove(this.cycleRecenterPitch);
		this.cycleRecenterPitch = null;
	} else {
		this.displayObject.drx = this.turnSpeed * -rad / Math.abs(rad);
	}
}

Ship.prototype.pitch = function(amount){
	/*this.pitchAmount = amount;
	this.displayObject.drx = this.turnSpeed * this.pitchAmount;
	let rad = this.displayObject.rotationQuat[3] * 2;
	if(this.displayObject.drx === 0 && rad !== 0 && this.cycleRecenterPitch == null) {
		this.cycleRecenterPitch = this.recenterPitch.bind(this);
		Cycle.add(this.cycleRecenterPitch);
	} else if(this.displayObject.drx === 0 && rad === 0 && !!this.cycleRecenterPitch) {
		Cycle.remove(this.cycleRecenterPitch);
		this.cycleRecenterPitch = null;
	}*/
};

Ship.prototype.yaw = function(amount){
	this.yawAmount = this.turnSpeed * amount;
};

Ship.prototype.thrust = function(amount){


	mat4.getRotation(this.scratchQuat, this.displayObject.transform);
	quat.normalize(this.scratchQuat, this.scratchQuat);
	vec3.transformQuat(this.scratchVec, vec3.set(this.scratchVec, 0, 0, amount), this.scratchQuat);
	vec3.add(this.velocity, this.velocity, this.scratchVec);
	this.speed = vec3.dist(this.velocity, vec3.set(this.scratchVec, 0, 0, 0));
	if(this.speed > this.topSpeed) {
		this.speed = this.topSpeed;
		vec3.normalize(this.velocity, this.velocity);
		vec3.scale(this.velocity,this.velocity, this.speed);
	}
	
};

Ship.prototype.barrel = function(amount){
	
	this.displayObject.drz = amount * this.barrelSpeed;
	//vec3.add(this.velocity, this.velocity, vec3.set(this.scratchVec, amount * .2, 0, 0));
	//mat4.rotateZ(this.displayObject.localTransform, this.displayObject.localTransform, 2 * Math.PI * amount);
	//mat4.translate(this.displayObject.localTransform, this.displayObject.localTransform, vec3.set(this.scratchVec, amount, 0, 0));
}

Ship.prototype.move = function() {

	vec3.rotateY(this.scratchVec, vec3.set(this.scratchVec, 0, 0, this.speed), vec3.set(this.scratchVec2, 0, 0, 0), this.yawAmount);
	
	quat.rotateY(this.displayObject.rotationQuat, this.displayObject.rotationQuat, vec3.angle(this.velocity, this.scratchVec));
	Log.log('yaw ', this.yawAmount);
	Log.log('rot ', vec3.angle(this.scratchVec, this.velocity) * 180 / Math.PI);

	vec3.add(this.velocity, this.velocity, this.scratchVec);

	this.speed = vec3.dist(this.velocity, vec3.set(this.scratchVec, 0, 0, 0));

	if(this.speed > this.topSpeed) {
		vec3.normalize(this.velocity, this.velocity);
		vec3.scale(this.velocity,this.velocity, this.topSpeed);
	}
	//Log.log('scratchVec ', this.scratchVec);

	Log.log('velocity X', this.velocity[0]);
	Log.log('velocity Y', this.velocity[1]);
	Log.log('velocity Z', this.velocity[2]);
	


	/*vec3.rotateX(this.scratchVec, vec3.set(this.scratchVec, 0, 0, this.speed), vec3.set(this.scratchVec2, 0, 0, 0), this.pitchAmount);
	
	vec3.add(this.velocity, this.velocity, this.scratchVec);

	this.speed = vec3.dist(this.velocity, vec3.set(this.scratchVec, 0, 0, 0));

	if(this.speed > this.topSpeed) {
		vec3.normalize(this.velocity, this.velocity);
		vec3.scale(this.velocity,this.velocity, this.speed);
	}

	quat.rotateX(this.displayObject.rotationQuat, this.displayObject.rotationQuat, vec3.angle(this.velocity, this.scratchVec));

	Log.log('Rotation X ', this.displayObject.rotationQuat[1] * 2 * 180 / Math.PI);
	Log.log('Rotation Y ', this.displayObject.rotationQuat[2] * 2 * 180 / Math.PI);
	Log.log('Rotation Z ', this.displayObject.rotationQuat[3] * 2 * 180 / Math.PI);
*/

	vec3.add(this.displayObject.translationVec, this.displayObject.translationVec, this.velocity);
	/*quat.set(this.rotationQuat, 
	quat.rotateX(this.rotationQuat, this.rotationQuat, this.drx);
	quat.rotateY(this.rotationQuat, this.rotationQuat, this.dry);
	quat.rotateZ(this.rotationQuat, this.rotationQuat, this.drz);*/
	this.displayObject.updateTransform();
};

module.exports = Ship;
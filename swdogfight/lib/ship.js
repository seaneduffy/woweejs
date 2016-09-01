'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4;

function Ship() {
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = .05;
	this.turnSpeed = Math.PI / 180 * 3;
	this.barrelSpeed = Math.PI / 180;
	this.scratchVec = vec3.create();
	this.scratchQuat = quat.create();
}

Ship.prototype.pitch = function(amount){
	this.pitchAmount = amount;
	this.displayObject.drx = this.turnSpeed * this.pitchAmount;
};

Ship.prototype.yaw = function(amount){
	this.yawAmount = amount;
	this.displayObject.dry = this.turnSpeed * this.yawAmount;
	console.log(this.displayObject.dry);
};

Ship.prototype.thrust = function(amount){

	mat4.getRotation(this.scratchQuat, this.displayObject.transform);
	quat.normalize(this.scratchQuat, this.scratchQuat);
	vec3.transformQuat(this.scratchVec, vec3.set(this.scratchVec, 0, 0, amount), this.scratchQuat);
	vec3.add(this.displayObject.velocity, this.displayObject.velocity, this.scratchVec);
	let speed = vec3.dist(this.displayObject.velocity, vec3.set(this.scratchVec, 0, 0, 0));
	if(speed > this.speed) {
		vec3.normalize(this.displayObject.velocity, this.displayObject.velocity);
		vec3.scale(this.displayObject.velocity,this.displayObject.velocity, this.speed);
	}
	
};

Ship.prototype.barrel = function(amount){
	
	this.displayObject.drz = amount * this.barrelSpeed;
	//vec3.add(this.displayObject.velocity, this.displayObject.velocity, vec3.set(this.scratchVec, amount * .2, 0, 0));
	//mat4.rotateZ(this.displayObject.localTransform, this.displayObject.localTransform, 2 * Math.PI * amount);
	//mat4.translate(this.displayObject.localTransform, this.displayObject.localTransform, vec3.set(this.scratchVec, amount, 0, 0));
}

module.exports = Ship;
'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4;

function Ship() {
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = 0;
	this.topSpeed = .3;
	this.scratchVec = vec3.create();
	this.scratchQuat = quat.create();
}

Ship.prototype.pitch = function(amount){
	this.pitchAmount = amount;
	if(Math.abs(this.pitchAmount) < .2) this.pitchAmount = 0;
	this.displayObject.drx = Math.PI / 128 * this.pitchAmount;
};

Ship.prototype.yaw = function(amount){
	this.yawAmount = amount;
	if(Math.abs(this.yawAmount) < .2) this.yawAmount = 0;
	this.displayObject.dry = Math.PI / 128 * this.yawAmount;
};

Ship.prototype.thrust = function(){
	
	this.changeSpeed(.01)

	vec3.set(this.scratchVec, 1, 1, 1);

	mat4.getRotation(this.scratchQuat, this.displayObject.transform);

	vec3.transformQuat(this.scratchVec, this.scratchVec, this.scratchQuat);

	vec3.scale(this.scratchVec, this.scratchVec, this.speed);
	
	vec3.add(this.displayObject.velocity, this.displayObject.velocity, this.scratchVec);
};

Ship.prototype.barrel = function(amount){
	this.displayObject.drz = amount * Math.PI / 180;
	vec3.add(this.displayObject.velocity, this.displayObject.velocity, vec3.set(this.scratchVec, amount * .2, 0, 0));
	//mat4.rotateZ(this.displayObject.localTransform, this.displayObject.localTransform, 2 * Math.PI * amount);
	//mat4.translate(this.displayObject.localTransform, this.displayObject.localTransform, vec3.set(this.scratchVec, amount, 0, 0));
}

Ship.prototype.brake = function(){
	this.changeSpeed(-.01);

	vec3.normalize(this.displayObject.velocity, this.displayObject.velocity);
	vec3.scale(this.displayObject.velocity, this.displayObject.velocity, this.speed);
};

Ship.prototype.changeSpeed = function(amount){
	this.speed += amount;
	if(this.speed > this.topSpeed) {
		this.speed = this.topSpeed;
	}
	else if(this.speed < 0) {
		this.speed = 0;
	}
};

module.exports = Ship;
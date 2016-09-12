'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4,
	Cycle = wowee.Cycle,
	Log = wowee.Log,
	DisplayObject3D = wowee.DisplayObject3D;

function Ship() {

	this.displayObject = new DisplayObject3D();
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.barrelAmount = 0;
	this.speed = 0;
	this.speedMax = .3;
	this.thrustAmount = 0;
	this.acceleration = .1;
	this.turnSpeed = Math.PI / 180 * -10;
	this.barrelSpeed = Math.PI / 180 * .1;
	this.zVec = vec3.fromValues(0, 0, 1);
	this.yVec = vec3.fromValues(0, 1, 0);
	this.xVec = vec3.fromValues(1, 0, 0);
	this.globalZVec = vec3.fromValues(0, 0, 1);
	this.globalYVec = vec3.fromValues(0, 1, 0);
	this.globalXVec = vec3.fromValues(1, 0, 0);
	this.originVec = vec3.create();
	this.thrustVec = vec3.create();
	this.yawQuat = quat.create();
	this.pitchQuat = quat.create();
	this.rollQuat = quat.create();
	this.rotQuat = quat.create();
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
	this.pitchAmount = this.turnSpeed * amount;
};

Ship.prototype.yaw = function(amount){
	this.yawAmount = this.turnSpeed * amount;
};

Ship.prototype.thrust = function(direction){
	this.thrustAmount = direction * this.acceleration;
};

Ship.prototype.barrel = function(direction){
	this.barrelAmount = this.barrelSpeed * direction;
}

Ship.prototype.move = function() {
	
	// Get yaw direction
	let yawDirection = this.yawAmount === 0 ? 0 : this.yawAmount / Math.abs(this.yawAmount),

	// Get pitch direction
		pitchDirection = this.pitchAmount === 0 ? 0 : this.pitchAmount / Math.abs(this.pitchAmount),

	// Get barrel direction
		barrelDirection = this.barrelAmount === 0 ? 0 : this.barrelAmount / Math.abs(this.barrelAmount);

	let directionChangePercent = 0;

	if(this.speed === 0 || this.thrustAmount >= this.speed) {
		directionChangePercent = 1;
	} else {
		directionChangePercent = this.thrustAmount / this.speed;
	}

	directionChangePercent = 1;

	let yawChange = this.yawAmount * directionChangePercent,
		pitchChange = this.pitchAmount * directionChangePercent;

	// Create thrust vec and add it to velocity
	vec3.scale(this.thrustVec, this.zVec, this.thrustAmount);
	quat.setAxisAngle(this.yawQuat, this.yVec, this.yawAmount);
	quat.setAxisAngle(this.pitchQuat, this.xVec, this.pitchAmount);
	quat.mul(this.rotQuat, this.yawQuat, this.pitchQuat);
	vec3.transformQuat(this.thrustVec, this.thrustVec, this.rotQuat);
	vec3.add(this.velocity, this.velocity, this.thrustVec);

	quat.setAxisAngle(this.yawQuat, this.yVec, yawChange);
	quat.setAxisAngle(this.pitchQuat, this.xVec, pitchChange);
	quat.mul(this.rotQuat, this.yawQuat, this.pitchQuat);

	vec3.transformQuat(this.zVec, this.zVec, this.rotQuat);
	vec3.transformQuat(this.xVec, this.xVec, this.yawQuat);
	vec3.transformQuat(this.yVec, this.yVec, this.pitchQuat);
	vec3.normalize(this.zVec, this.zVec);
	vec3.normalize(this.xVec, this.xVec);
	vec3.normalize(this.yVec, this.yVec);
                                                        
	quat.setAxisAngle(this.yawQuat, this.globalYVec, yawChange);
	quat.setAxisAngle(this.pitchQuat, this.globalXVec, pitchChange);
	quat.mul(this.rotQuat, this.yawQuat, this.pitchQuat);

	quat.mul(this.displayObject.rotationQuat, this.displayObject.rotationQuat, this.rotQuat);

	this.speed = vec3.distance(this.velocity, this.originVec);

	if(this.speed > this.speedMax) {
		this.speed = this.speedMax;
		vec3.normalize(this.velocity, this.velocity);
		vec3.scale(this.velocity, this.velocity, this.speed);
	}

	vec3.add(this.displayObject.translationVec, this.displayObject.translationVec, this.velocity);

	this.displayObject.updateTransform();
};

module.exports = Ship;
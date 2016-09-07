'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4,
	Cycle = wowee.Cycle,
	Log = wowee.Log,
	DisplayObject3D = wowee.DisplayObject3D;

function Ship() {

	this.translationNode = new DisplayObject3D();
	this.rotationNode = new DisplayObject3D();
	this.displayObject = new DisplayObject3D();

	this.translationNode.addChild(this.rotationNode);
	//this.rotationNode.addChild(this.displayObject);
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = 0;
	this.topSpeed = 1;
	this.acceleration = .01;
	this.turnSpeed = Math.PI / 180 * 10;
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
	this.pitchAmount = amount;
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

	this.speed += amount;

	

	if(this.speed > this.topSpeed) {
		this.speed = this.topSpeed;
	} else if(this.speed < 0) {
		this.speed = 0;
	}

	Log.log('speed', this.speed);
	Log.log('top speed', this.topSpeed);
	
};

Ship.prototype.barrel = function(amount){
	
	//this.displayObject.drz = amount * this.barrelSpeed;
	//vec3.add(this.velocity, this.velocity, vec3.set(this.scratchVec, amount * .2, 0, 0));
	//mat4.rotateZ(this.displayObject.localTransform, this.displayObject.localTransform, 2 * Math.PI * amount);
	//mat4.translate(this.displayObject.localTransform, this.displayObject.localTransform, vec3.set(this.scratchVec, amount, 0, 0));
}

Ship.prototype.move = function() {

	// Velocity speed
	let d = vec3.dist(this.velocity, vec3.set(this.scratchVec, 0, 0, 0)),

	// Get yaw direction
		yawDirection = this.yawAmount === 0 ? 0 : this.yawAmount / Math.abs(this.yawAmount),

	// Get pitch direction
		pitchDirection = this.pitchAmount === 0 ? 0 : this.pitchAmount / Math.abs(this.pitchAmount);

	if(d === 0) {

	// If curr speed is 0, set temp velocity to base new speed
		vec3.set(this.scratchVec, 0, 0, this.speed);
	} else {

	// If curr speed is not 0, set temp velocity to normalized and scaled curr velocity
		vec3.scale(this.scratchVec, vec3.normalize(this.scratchVec, vec3.set(this.scratchVec2, 0, 0, 0)), this.speed);
	}

	// Temp velocity speed
	d = vec3.dist(this.scratchVec, vec3.set(this.scratchVec2, 0, 0, 0));

	// If temp velocity speed is 0, do nothing
	if(d === 0 && this.speed === 0) {
		return;
	}

	// Rotate temp velocity by yaw
	vec3.rotateY(this.scratchVec, this.scratchVec, this.velocity, this.yawAmount);

	// Rotate temp velocity by pitch
	vec3.rotateX(this.scratchVec, this.scratchVec, this.velocity, this.pitchAmount);

	// Add temp velocity to velocity 
	vec3.add(this.scratchVec, this.scratchVec, this.velocity);

	// Temp velocity speed
	d = vec3.dist(this.scratchVec, vec3.set(this.scratchVec2, 0, 0, 0));

	// Speed must be between 0 and top speed
	/*if(d > this.topSpeed) {
		d = this.topSpeed;
	} else if(d < 0) {
		d = 0;
	}
	this.speed = d;*/
	vec3.scale(this.scratchVec, vec3.normalize(this.scratchVec, this.scratchVec), this.speed);

	// Equalize Y value of temp and velocity in order to calculate Y angle
	vec3.set(this.scratchVec2, this.scratchVec[0], this.velocity[1], this.scratchVec[2]);

	let diffAngleY = vec3.angle(this.scratchVec2, this.velocity) * -yawDirection;

	// Equalize X value of temp and velocity in order to calculate X angle
	vec3.set(this.scratchVec2, this.velocity[0], this.scratchVec[1], this.scratchVec[2]);

	let diffAngleX = vec3.angle(this.scratchVec2, this.velocity) * -pitchDirection;

	quat.rotateY(this.rotationNode.rotationQuat, this.rotationNode.rotationQuat, diffAngleY);
	quat.rotateX(this.rotationNode.rotationQuat, this.rotationNode.rotationQuat, diffAngleX);
	
	vec3.copy(this.velocity, this.scratchVec);

	vec3.add(this.translationNode.translationVec, this.translationNode.translationVec, this.velocity);

	this.translationNode.updateTransform();
	
	/*Log.log('velocity ', this.velocity[0]+' '+this.velocity[1]+' '+this.velocity[2]);
	Log.log('speed ', this.speed);
	Log.log('yaw ', this.yawAmount);
	Log.log('pitch ', this.pitchAmount);*/

	
};

module.exports = Ship;
'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4,
	Cycle = wowee.Cycle,
	Log = wowee.Log,
	DisplayObject3D = wowee.DisplayObject3D,
	Laser = require('./laser');

function Ship() {

	
	this.speedMax = 4;
	this.thrustAmount = 0;
	this.acceleration = .3;
	this.turnSpeed = Math.PI / 180 * -10;
	this.rollSpeed = Math.PI / 180 * 4;
	this.barrelSpeed = 200;
	this.barrelRollSpeed = Math.PI / 180 * 10;


	this.displayObject = new DisplayObject3D();
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.rollAmount = 0;
	this.speed = 0;
	this.thrustVec = vec3.create();
	this.originVec = vec3.create();
	this.barrelVec = vec3.create();
	this.barreling = false;
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

Ship.prototype.fire = function() {
	let laser = new Laser(this.displayObject.translationVec, this.displayObject.zVec);
};

Ship.prototype.pitch = function(amount){
	this.pitchAmount = this.turnSpeed * amount;
};

Ship.prototype.yaw = function(amount){
	this.yawAmount = this.turnSpeed * amount;
};

Ship.prototype.thrust = function(direction){
	this.thrustAmount = direction * this.acceleration;
};

Ship.prototype.roll = function(direction){
	this.rollAmount = this.rollSpeed * direction;
};

Ship.prototype.barrel = function(direction){

	if(this.barreling) {
		return;
	}

	this.barrelAmount = this.barrelSpeed * -direction;
	this.rollAmount = this.barrelRollSpeed * direction;
	this.barreling = true;

	vec3.scale(this.barrelVec, this.displayObject.xVec, this.barrelAmount);

	vec3.add(this.displayObject.velocity, this.displayObject.velocity, this.barrelVec);

	Cycle.delay(()=>{
		this.barreling = false;
		this.rollAmount = 0;
	}, 4);

};

Ship.prototype.move = function() {

	if(this.barreling) {
		this.displayObject.roll(this.rollAmount);
	} else {
		this.displayObject.yaw(this.yawAmount);
		this.displayObject.pitch(this.pitchAmount);
		this.displayObject.roll(this.rollAmount);
		this.displayObject.force(this.displayObject.zVec, this.thrustAmount);
	}

	this.speed = vec3.distance(this.displayObject.velocity, this.originVec);

	if(this.speed > this.speedMax) {
		this.speed = this.speedMax;
		vec3.normalize(this.displayObject.velocity, this.displayObject.velocity);
		vec3.scale(this.displayObject.velocity, this.displayObject.velocity, this.speed);
	}

};

module.exports = Ship;
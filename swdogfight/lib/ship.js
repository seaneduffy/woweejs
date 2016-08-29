'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3;

function Ship() {
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = 0;
	this.topSpeed = .3;
	this.scratchVec = vec3.create();
	this.scratchVec2 = vec3.create();
}

Ship.prototype.pitch = function(amount){
	this.pitchAmount = amount;
	//this.displayObject.dy = this.speed * this.pitchAmount;
	if(Math.abs(this.pitchAmount) < .2) this.pitchAmount = 0;
	this.displayObject.drx = Math.PI / 128 * this.pitchAmount;// * this.speed / this.topSpeed;
}

Ship.prototype.yaw = function(amount){
	this.yawAmount = amount;
	if(Math.abs(this.yawAmount) < .2) this.yawAmount = 0;
	this.displayObject.dry = Math.PI / 128 * this.yawAmount;// * this.speed / this.topSpeed;
}

Ship.prototype.thrust = function(){
	this.changeSpeed(.01)
}

Ship.prototype.changeSpeed = function(amount){
	this.speed += amount;
	if(this.speed > this.topSpeed) {
		this.speed = this.topSpeed;
	}
	else if(this.speed < 0) {
		this.speed = 0;
	}
	vec3.set(this.scratchVec, 0, 0, 1);
	vec3.set(this.scratchVec2, 0, 0, 0);
	if(this.displayObject.rotationX !== 0)
	vec3.rotateX(this.scratchVec, this.scratchVec, this.scratchVec2, this.displayObject.rotationX);
	if(this.displayObject.rotationY !== 0)
	vec3.rotateY(this.scratchVec, this.scratchVec, this.scratchVec2, this.displayObject.rotationY);
	if(this.displayObject.rotationZ !== 0)
	vec3.rotateZ(this.scratchVec, this.scratchVec, this.scratchVec2, this.displayObject.rotationZ);
	vec3.scale(this.scratchVec, this.scratchVec, this.speed);
	
	vec3.add(this.displayObject.velocity, this.displayObject.velocity, this.scratchVec);
}

Ship.prototype.brake = function(){
	this.changeSpeed(-.01);
}

module.exports = Ship;
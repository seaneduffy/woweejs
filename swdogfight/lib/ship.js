'use strict';

function Ship() {
	
	this.pitchAmount = 0;
	this.yawAmount = 0;
	this.speed = 0;
	this.topSpeed = .3;
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
	this.speed += .01;
	if(this.speed > this.topSpeed) {
		this.speed = this.topSpeed;
	}
	//this.displayObject.drx = Math.PI / 16 * this.pitchAmount;// * this.speed / this.topSpeed;
	//this.displayObject.dy = this.speed * this.pitchAmount;
	//this.displayObject.dry = Math.PI / 16 * this.yawAmount;// * this.speed / this.topSpeed;
	this.displayObject.dz = this.speed;
}

Ship.prototype.brake = function(){
	this.speed -= .01;
	if(this.speed < 0) {
		this.speed = 0;
	}
	//this.displayObject.drx = Math.PI / 16 * this.pitchAmount;// * this.speed / this.topSpeed;
	//this.displayObject.dy = this.speed * this.pitchAmount;
	//this.displayObject.dry = Math.PI / 16 * this.yawAmount;// * this.speed / this.topSpeed;
	this.displayObject.dz = this.speed;
}

module.exports = Ship;
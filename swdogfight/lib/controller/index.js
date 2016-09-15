'use strict';

let viewport = wowee.Viewport.getViewport(),
	Log = wowee.Log,
	Cycle = wowee.Cycle,
	PITCH = 'pitch',
	PITCH_OFF = 'pitchoff',
	YAW = 'yaw',
	YAW_OFF = 'yawoff',
	ROLL = 'roll',
	ROLL_OFF = 'rolloff',
	BARREL = 'barrel',
	THRUST = 'thrust',
	THRUST_OFF = 'thrustoff',
	BRAKE = 'brake',
	BRAKE_OFF = 'brakeoff',
	FIRE = 'fire',

yawLimit = .05,

pitchLimit = .05,

barrelLimit = .3,

barrelReadyLeft = false,

barrelReadyRight = false,

listeners = {},

controls = {},

on = function( event, cb ) {

	if(typeof listeners[event] === 'undefined') {
		listeners[event] = [];
	}
	listeners[ event ].push( cb );
};

function Control(label){
	this.label = label;
	this.active = false;
	this.continuousActivation = false;
}

Control.prototype = Object.create(null, {});

Control.prototype.activate = function(message){
	if((!this.active || this.continuousActivation) && !!listeners[this.label]) {
		this.active = true;
		if(!this.continuousActivation) {
			this.cycleSendMessage = this.sendMessage.bind(this, message);
			Cycle.add(this.cycleSendMessage);
		} else {
			this.sendMessage(message);
		}
	}
}

Control.prototype.deactivate = function(message){
	if(this.active && !!listeners[this.label+'off']) {
		this.active = false;
		listeners[this.label+'off'].forEach( func=> {
			func(message);
		});
		if(!this.active) {
			Cycle.remove(this.cycleSendMessage);
		}
	}
}

Control.prototype.sendMessage = function(message){
	listeners[this.label].forEach( func=> {
		func(message);
	});
}

controls[PITCH] = new Control(PITCH);
controls[PITCH].continuousActivation = true;
controls[YAW] = new Control(YAW);
controls[YAW].continuousActivation = true;
controls[ROLL] = new Control(ROLL);
controls[THRUST] = new Control(THRUST);
controls[BRAKE] = new Control(BRAKE);
controls[BARREL] = new Control(BARREL);
controls[BARREL].continuousActivation = true;
controls[FIRE] = new Control(FIRE);
controls[FIRE].continuousActivation = true;

document.body.addEventListener( 'mousemove', event => {
	let per = event.pageX / viewport.width,
		amount = null;

	per = per > 1 ? 1 : per;
	per = per < 0 ? 0 : per;
	amount = per - .5;
	if(Math.abs(amount) > yawLimit) {
		controls[YAW].activate(amount);
	} else {
		controls[YAW].deactivate();
	}

	if(amount < -barrelLimit) {
		barrelReadyRight = true;
	} else {
		barrelReadyRight = false;
	}
	if(amount > barrelLimit) {
		barrelReadyLeft = true;
	} else {
		barrelReadyLeft = false;
	}

	per = event.pageY / viewport.height;
	per = per > 1 ? 1 : per;
	per = per < 0 ? 0 : per;
	amount = per - .5;
	if(Math.abs(amount) > pitchLimit) {
		controls[PITCH].activate(amount);
	} else {
		controls[PITCH].deactivate();
	}
});

document.body.addEventListener( 'keydown', event => {
	if(event.code === 'KeyW') {
		controls[THRUST].activate();
	} else if(event.code === 'KeyS') {
		controls[BRAKE].activate();
	} else if(event.code === 'KeyA') {
		if(barrelReadyLeft) {
			controls[BARREL].activate(-1);
		} else {
			controls[ROLL].activate(-1);
		}
	} else if(event.code === 'KeyD') {
		if(barrelReadyRight) {
			controls[BARREL].activate(1);
		} else {
			controls[ROLL].activate(1);
		}
	} else if(event.code === 'Space') {
		controls[FIRE].activate();
	}
});

document.body.addEventListener( 'keyup', event => {
	if(event.code === 'KeyA' || event.code === 'KeyD') {
		controls[ROLL].deactivate();
	} else if(event.code === 'KeyW') {
		controls[THRUST].deactivate();
	} else if(event.code === 'KeyS') {
		controls[BRAKE].deactivate();
	}
});

module.exports = {
	on: on,
	PITCH: PITCH,
	PITCH_OFF: PITCH_OFF,
	YAW: YAW,
	YAW_OFF: YAW_OFF,
	ROLL: ROLL,
	ROLL_OFF: ROLL_OFF,
	THRUST: THRUST,
	THRUST_OFF: THRUST_OFF,
	BRAKE: BRAKE,
	BRAKE_OFF: BRAKE_OFF,
	BARREL: BARREL,
	FIRE: FIRE
};
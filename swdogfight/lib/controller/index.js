'use strict';

let PITCH = 'pitch',
BARREL_LEFT = 'barrelleft',
FORWARD = 'forward',
YAW = 'yaw',
BACK = 'back',
BARREL_RIGHT = 'barrelright',
BRAKE = 'brake',
STOP_BARREL = 'stopbarrel',

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
}

controls[BARREL_RIGHT] = new Control(BARREL_RIGHT);
controls[BARREL_LEFT] = new Control(BARREL_LEFT);

document.body.addEventListener( 'mousemove', event => {
	let hw = viewport.width / 2,
		hh = viewport.height / 2,
		dmin = hw > hh ? hh : hw;
	if(event.pageX > hw / 2) {
		if(!!listeners[YAW])
		listeners[YAW].forEach( func=> {
			func(-(event.pageX - hw) / dmin);
		});
	} else {
		if(!!listeners[YAW])
		listeners[YAW].forEach( func=> {
			func((hw - event.pageX) / dmin);
		});
	}
	if(event.pageY > hh / 2) {
		if(!!listeners[PITCH])
		listeners[PITCH].forEach( func=> {
			func(-(event.pageY - hh) / dmin);
		});
	} else {
		if(!!listeners[PITCH])
		listeners[PITCH].forEach( func=> {
			func((hh - event.pageY) / dmin);
		});
	}
});

document.body.addEventListener( 'keydown', event => {

	if(event.code === 'KeyW') {
		if(!!listeners[FORWARD])
		listeners[FORWARD].forEach( func=>{
			func();
		} );
	} else if(event.code === 'KeyS') {
		if(!!listeners[BRAKE])
		listeners[BRAKE].forEach( func=>{
			func();
		} );
	} else if(event.code === 'KeyA') {
		if(!!listeners[BARREL_LEFT] && !controls[BARREL_LEFT].active) {
			controls[BARREL_LEFT].active = true;
			listeners[BARREL_LEFT].forEach( func=>{
				console.log('a');
				func();
			} );
		}
	} else if(event.code === 'KeyD') {
		if(!!listeners[BARREL_RIGHT] && !controls[BARREL_RIGHT].active) {
			controls[BARREL_RIGHT].active = true;
			listeners[BARREL_RIGHT].forEach( func=>{
				console.log('d');
				func();
			} );
		}
	}
});

document.body.addEventListener( 'keyup', event => {
	if(event.code === 'KeyA' || event.code === 'KeyD') {
		controls[BARREL_LEFT].active = false;
		controls[BARREL_RIGHT].active = false;
		if(!!listeners[STOP_BARREL]) {
			listeners[STOP_BARREL].forEach( func=>{
				console.log('c');
				func();
			} );
		}
	}
});

module.exports = {
	on: on,
	PITCH: PITCH,
	BARREL_LEFT: BARREL_LEFT,
	FORWARD: FORWARD,
	YAW: YAW,
	BACK: BACK,
	BARREL_RIGHT: BARREL_RIGHT,
	BRAKE: BRAKE,
	STOP_BARREL: STOP_BARREL
};
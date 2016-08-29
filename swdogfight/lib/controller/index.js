'use strict';

let PITCH = 'pitch',
BARREL_LEFT = 'barrelleft',
FORWARD = 'forward',
YAW = 'yaw',
BACK = 'back',
BARREL_RIGHT = 'barrelright',
BRAKE = 'brake',

listeners = {},

on = function( event, cb ) {

	if(typeof listeners[event] === 'undefined') {
		listeners[event] = [];
	}
	listeners[ event ].push( cb );
};

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
		if(!!listeners[BARREL_LEFT])
		listeners[BARREL_LEFT].forEach( func=>{
			func();
		} );
	} else if(event.code === 'KeyD') {
		if(!!listeners[BARREL_RIGHT])
		listeners[BARREL_RIGHT].forEach( func=>{
			func();
		} );
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
	BRAKE: BRAKE
};
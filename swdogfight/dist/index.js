(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
(function(){
	let Controller = require('./lib/controller'),
		Ship = require('./lib/ship');
	
	let game = wowee({
		root: document.getElementById("game"), 
		width: 900, 
		height: 600,
		frame_rate: 400,
		background: "black",
		material_path: "/"
	});
	
	let tie = new Ship();
	
	tie.displayObject = new DisplayObject3D({
		isPlane: false,
		mesh: '/tie.json',
		material: '/tie_fighter.png',
		shaders: [
			{
				type: 'texture',
				shapes: 'TRIANGLES'
			}
		],
		id: 'tie'
	});
	
	let tie2 = new DisplayObject3D({
			isPlane: false,
			mesh: '/tie.json',
			material: '/tie_fighter.png',
			shaders: [
				{
					type: 'texture',
					shapes: 'TRIANGLES'
				}
			],
			id: 'tie'
		}),
	tie3 = new DisplayObject3D({
		isPlane: false,
		mesh: '/tie.json',
		material: '/tie_fighter.png',
		shaders: [
			{
				type: 'texture',
				shapes: 'TRIANGLES'
			}
		],
		id: 'tie'
	});
	
	Promise.all([
		tie.displayObject.init(),
		tie2.init(),
		tie3.init()
	]).then(function(){
		let camera = new Camera(1080, 720);
		viewport.camera = camera;
		viewport.addChild(tie.displayObject);
		viewport.addChild(tie2);
		viewport.addChild(tie3);
		
		tie.displayObject.z = 2;
		tie2.z = 46;
		tie2.x = 4;
		
		tie3.z = 55;
		tie3.y = 2;
		
		camera.follow(tie.displayObject, 6);
		
		Controller.on(Controller.PITCH, function(amount){
			tie.pitch(amount);
		});
		Controller.on(Controller.YAW, function(amount){
			tie.yaw(amount);
		});
		Controller.on(Controller.FORWARD, function(){
			tie.thrust();
		});
		Controller.on(Controller.BRAKE, function(){
			tie.brake();
		});
		
		tie.rotationY = Math.PI / 4;
		
	});
	
}());
},{"./lib/controller":2,"./lib/ship":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9jb250cm9sbGVyL2luZGV4LmpzIiwibGliL3NoaXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4oZnVuY3Rpb24oKXtcblx0bGV0IENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2xpYi9jb250cm9sbGVyJyksXG5cdFx0U2hpcCA9IHJlcXVpcmUoJy4vbGliL3NoaXAnKTtcblx0XG5cdGxldCBnYW1lID0gd293ZWUoe1xuXHRcdHJvb3Q6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZVwiKSwgXG5cdFx0d2lkdGg6IDkwMCwgXG5cdFx0aGVpZ2h0OiA2MDAsXG5cdFx0ZnJhbWVfcmF0ZTogNDAwLFxuXHRcdGJhY2tncm91bmQ6IFwiYmxhY2tcIixcblx0XHRtYXRlcmlhbF9wYXRoOiBcIi9cIlxuXHR9KTtcblx0XG5cdGxldCB0aWUgPSBuZXcgU2hpcCgpO1xuXHRcblx0dGllLmRpc3BsYXlPYmplY3QgPSBuZXcgRGlzcGxheU9iamVjdDNEKHtcblx0XHRpc1BsYW5lOiBmYWxzZSxcblx0XHRtZXNoOiAnL3RpZS5qc29uJyxcblx0XHRtYXRlcmlhbDogJy90aWVfZmlnaHRlci5wbmcnLFxuXHRcdHNoYWRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogJ3RleHR1cmUnLFxuXHRcdFx0XHRzaGFwZXM6ICdUUklBTkdMRVMnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRpZDogJ3RpZSdcblx0fSk7XG5cdFxuXHRsZXQgdGllMiA9IG5ldyBEaXNwbGF5T2JqZWN0M0Qoe1xuXHRcdFx0aXNQbGFuZTogZmFsc2UsXG5cdFx0XHRtZXNoOiAnL3RpZS5qc29uJyxcblx0XHRcdG1hdGVyaWFsOiAnL3RpZV9maWdodGVyLnBuZycsXG5cdFx0XHRzaGFkZXJzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAndGV4dHVyZScsXG5cdFx0XHRcdFx0c2hhcGVzOiAnVFJJQU5HTEVTJ1xuXHRcdFx0XHR9XG5cdFx0XHRdLFxuXHRcdFx0aWQ6ICd0aWUnXG5cdFx0fSksXG5cdHRpZTMgPSBuZXcgRGlzcGxheU9iamVjdDNEKHtcblx0XHRpc1BsYW5lOiBmYWxzZSxcblx0XHRtZXNoOiAnL3RpZS5qc29uJyxcblx0XHRtYXRlcmlhbDogJy90aWVfZmlnaHRlci5wbmcnLFxuXHRcdHNoYWRlcnM6IFtcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogJ3RleHR1cmUnLFxuXHRcdFx0XHRzaGFwZXM6ICdUUklBTkdMRVMnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRpZDogJ3RpZSdcblx0fSk7XG5cdFxuXHRQcm9taXNlLmFsbChbXG5cdFx0dGllLmRpc3BsYXlPYmplY3QuaW5pdCgpLFxuXHRcdHRpZTIuaW5pdCgpLFxuXHRcdHRpZTMuaW5pdCgpXG5cdF0pLnRoZW4oZnVuY3Rpb24oKXtcblx0XHRsZXQgY2FtZXJhID0gbmV3IENhbWVyYSgxMDgwLCA3MjApO1xuXHRcdHZpZXdwb3J0LmNhbWVyYSA9IGNhbWVyYTtcblx0XHR2aWV3cG9ydC5hZGRDaGlsZCh0aWUuZGlzcGxheU9iamVjdCk7XG5cdFx0dmlld3BvcnQuYWRkQ2hpbGQodGllMik7XG5cdFx0dmlld3BvcnQuYWRkQ2hpbGQodGllMyk7XG5cdFx0XG5cdFx0dGllLmRpc3BsYXlPYmplY3QueiA9IDI7XG5cdFx0dGllMi56ID0gNDY7XG5cdFx0dGllMi54ID0gNDtcblx0XHRcblx0XHR0aWUzLnogPSA1NTtcblx0XHR0aWUzLnkgPSAyO1xuXHRcdFxuXHRcdGNhbWVyYS5mb2xsb3codGllLmRpc3BsYXlPYmplY3QsIDYpO1xuXHRcdFxuXHRcdENvbnRyb2xsZXIub24oQ29udHJvbGxlci5QSVRDSCwgZnVuY3Rpb24oYW1vdW50KXtcblx0XHRcdHRpZS5waXRjaChhbW91bnQpO1xuXHRcdH0pO1xuXHRcdENvbnRyb2xsZXIub24oQ29udHJvbGxlci5ZQVcsIGZ1bmN0aW9uKGFtb3VudCl7XG5cdFx0XHR0aWUueWF3KGFtb3VudCk7XG5cdFx0fSk7XG5cdFx0Q29udHJvbGxlci5vbihDb250cm9sbGVyLkZPUldBUkQsIGZ1bmN0aW9uKCl7XG5cdFx0XHR0aWUudGhydXN0KCk7XG5cdFx0fSk7XG5cdFx0Q29udHJvbGxlci5vbihDb250cm9sbGVyLkJSQUtFLCBmdW5jdGlvbigpe1xuXHRcdFx0dGllLmJyYWtlKCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGllLnJvdGF0aW9uWSA9IE1hdGguUEkgLyA0O1xuXHRcdFxuXHR9KTtcblx0XG59KCkpOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IFBJVENIID0gJ3BpdGNoJyxcbkJBUlJFTF9MRUZUID0gJ2JhcnJlbGxlZnQnLFxuRk9SV0FSRCA9ICdmb3J3YXJkJyxcbllBVyA9ICd5YXcnLFxuQkFDSyA9ICdiYWNrJyxcbkJBUlJFTF9SSUdIVCA9ICdiYXJyZWxyaWdodCcsXG5CUkFLRSA9ICdicmFrZScsXG5cbmxpc3RlbmVycyA9IHt9LFxuXG5vbiA9IGZ1bmN0aW9uKCBldmVudCwgY2IgKSB7XG5cblx0aWYodHlwZW9mIGxpc3RlbmVyc1tldmVudF0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0bGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuXHR9XG5cdGxpc3RlbmVyc1sgZXZlbnQgXS5wdXNoKCBjYiApO1xufTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZXZlbnQgPT4ge1xuXHRsZXQgaHcgPSB2aWV3cG9ydC53aWR0aCAvIDIsXG5cdFx0aGggPSB2aWV3cG9ydC5oZWlnaHQgLyAyLFxuXHRcdGRtaW4gPSBodyA+IGhoID8gaGggOiBodztcblx0aWYoZXZlbnQucGFnZVggPiBodyAvIDIpIHtcblx0XHRpZighIWxpc3RlbmVyc1tZQVddKVxuXHRcdGxpc3RlbmVyc1tZQVddLmZvckVhY2goIGZ1bmM9PiB7XG5cdFx0XHRmdW5jKC0oZXZlbnQucGFnZVggLSBodykgLyBkbWluKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRpZighIWxpc3RlbmVyc1tZQVddKVxuXHRcdGxpc3RlbmVyc1tZQVddLmZvckVhY2goIGZ1bmM9PiB7XG5cdFx0XHRmdW5jKChodyAtIGV2ZW50LnBhZ2VYKSAvIGRtaW4pO1xuXHRcdH0pO1xuXHR9XG5cdGlmKGV2ZW50LnBhZ2VZID4gaGggLyAyKSB7XG5cdFx0aWYoISFsaXN0ZW5lcnNbUElUQ0hdKVxuXHRcdGxpc3RlbmVyc1tQSVRDSF0uZm9yRWFjaCggZnVuYz0+IHtcblx0XHRcdGZ1bmMoLShldmVudC5wYWdlWSAtIGhoKSAvIGRtaW4pO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGlmKCEhbGlzdGVuZXJzW1BJVENIXSlcblx0XHRsaXN0ZW5lcnNbUElUQ0hdLmZvckVhY2goIGZ1bmM9PiB7XG5cdFx0XHRmdW5jKChoaCAtIGV2ZW50LnBhZ2VZKSAvIGRtaW4pO1xuXHRcdH0pO1xuXHR9XG59KTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGV2ZW50ID0+IHtcblxuXHRpZihldmVudC5jb2RlID09PSAnS2V5VycpIHtcblx0XHRpZighIWxpc3RlbmVyc1tGT1JXQVJEXSlcblx0XHRsaXN0ZW5lcnNbRk9SV0FSRF0uZm9yRWFjaCggZnVuYz0+e1xuXHRcdFx0ZnVuYygpO1xuXHRcdH0gKTtcblx0fSBlbHNlIGlmKGV2ZW50LmNvZGUgPT09ICdLZXlTJykge1xuXHRcdGlmKCEhbGlzdGVuZXJzW0JSQUtFXSlcblx0XHRsaXN0ZW5lcnNbQlJBS0VdLmZvckVhY2goIGZ1bmM9Pntcblx0XHRcdGZ1bmMoKTtcblx0XHR9ICk7XG5cdH0gZWxzZSBpZihldmVudC5jb2RlID09PSAnS2V5QScpIHtcblx0XHRpZighIWxpc3RlbmVyc1tCQVJSRUxfTEVGVF0pXG5cdFx0bGlzdGVuZXJzW0JBUlJFTF9MRUZUXS5mb3JFYWNoKCBmdW5jPT57XG5cdFx0XHRmdW5jKCk7XG5cdFx0fSApO1xuXHR9IGVsc2UgaWYoZXZlbnQuY29kZSA9PT0gJ0tleUQnKSB7XG5cdFx0aWYoISFsaXN0ZW5lcnNbQkFSUkVMX1JJR0hUXSlcblx0XHRsaXN0ZW5lcnNbQkFSUkVMX1JJR0hUXS5mb3JFYWNoKCBmdW5jPT57XG5cdFx0XHRmdW5jKCk7XG5cdFx0fSApO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG9uOiBvbixcblx0UElUQ0g6IFBJVENILFxuXHRCQVJSRUxfTEVGVDogQkFSUkVMX0xFRlQsXG5cdEZPUldBUkQ6IEZPUldBUkQsXG5cdFlBVzogWUFXLFxuXHRCQUNLOiBCQUNLLFxuXHRCQVJSRUxfUklHSFQ6IEJBUlJFTF9SSUdIVCxcblx0QlJBS0U6IEJSQUtFXG59OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gU2hpcCgpIHtcblx0XG5cdHRoaXMucGl0Y2hBbW91bnQgPSAwO1xuXHR0aGlzLnlhd0Ftb3VudCA9IDA7XG5cdHRoaXMuc3BlZWQgPSAwO1xuXHR0aGlzLnRvcFNwZWVkID0gLjM7XG59XG5cblNoaXAucHJvdG90eXBlLnBpdGNoID0gZnVuY3Rpb24oYW1vdW50KXtcblx0dGhpcy5waXRjaEFtb3VudCA9IGFtb3VudDtcblx0Ly90aGlzLmRpc3BsYXlPYmplY3QuZHkgPSB0aGlzLnNwZWVkICogdGhpcy5waXRjaEFtb3VudDtcblx0aWYoTWF0aC5hYnModGhpcy5waXRjaEFtb3VudCkgPCAuMikgdGhpcy5waXRjaEFtb3VudCA9IDA7XG5cdHRoaXMuZGlzcGxheU9iamVjdC5kcnggPSBNYXRoLlBJIC8gMTI4ICogdGhpcy5waXRjaEFtb3VudDsvLyAqIHRoaXMuc3BlZWQgLyB0aGlzLnRvcFNwZWVkO1xufVxuXG5TaGlwLnByb3RvdHlwZS55YXcgPSBmdW5jdGlvbihhbW91bnQpe1xuXHR0aGlzLnlhd0Ftb3VudCA9IGFtb3VudDtcblx0aWYoTWF0aC5hYnModGhpcy55YXdBbW91bnQpIDwgLjIpIHRoaXMueWF3QW1vdW50ID0gMDtcblx0dGhpcy5kaXNwbGF5T2JqZWN0LmRyeSA9IE1hdGguUEkgLyAxMjggKiB0aGlzLnlhd0Ftb3VudDsvLyAqIHRoaXMuc3BlZWQgLyB0aGlzLnRvcFNwZWVkO1xufVxuXG5TaGlwLnByb3RvdHlwZS50aHJ1c3QgPSBmdW5jdGlvbigpe1xuXHR0aGlzLnNwZWVkICs9IC4wMTtcblx0aWYodGhpcy5zcGVlZCA+IHRoaXMudG9wU3BlZWQpIHtcblx0XHR0aGlzLnNwZWVkID0gdGhpcy50b3BTcGVlZDtcblx0fVxuXHQvL3RoaXMuZGlzcGxheU9iamVjdC5kcnggPSBNYXRoLlBJIC8gMTYgKiB0aGlzLnBpdGNoQW1vdW50Oy8vICogdGhpcy5zcGVlZCAvIHRoaXMudG9wU3BlZWQ7XG5cdC8vdGhpcy5kaXNwbGF5T2JqZWN0LmR5ID0gdGhpcy5zcGVlZCAqIHRoaXMucGl0Y2hBbW91bnQ7XG5cdC8vdGhpcy5kaXNwbGF5T2JqZWN0LmRyeSA9IE1hdGguUEkgLyAxNiAqIHRoaXMueWF3QW1vdW50Oy8vICogdGhpcy5zcGVlZCAvIHRoaXMudG9wU3BlZWQ7XG5cdHRoaXMuZGlzcGxheU9iamVjdC5keiA9IHRoaXMuc3BlZWQ7XG59XG5cblNoaXAucHJvdG90eXBlLmJyYWtlID0gZnVuY3Rpb24oKXtcblx0dGhpcy5zcGVlZCAtPSAuMDE7XG5cdGlmKHRoaXMuc3BlZWQgPCAwKSB7XG5cdFx0dGhpcy5zcGVlZCA9IDA7XG5cdH1cblx0Ly90aGlzLmRpc3BsYXlPYmplY3QuZHJ4ID0gTWF0aC5QSSAvIDE2ICogdGhpcy5waXRjaEFtb3VudDsvLyAqIHRoaXMuc3BlZWQgLyB0aGlzLnRvcFNwZWVkO1xuXHQvL3RoaXMuZGlzcGxheU9iamVjdC5keSA9IHRoaXMuc3BlZWQgKiB0aGlzLnBpdGNoQW1vdW50O1xuXHQvL3RoaXMuZGlzcGxheU9iamVjdC5kcnkgPSBNYXRoLlBJIC8gMTYgKiB0aGlzLnlhd0Ftb3VudDsvLyAqIHRoaXMuc3BlZWQgLyB0aGlzLnRvcFNwZWVkO1xuXHR0aGlzLmRpc3BsYXlPYmplY3QuZHogPSB0aGlzLnNwZWVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7Il19

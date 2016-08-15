(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

let cycleFunctions = new Array(),
	delayFunctions = new Array(),
	active = false,
	frameRate = 1,
	startTime = 0;

function cycle() {



	if(active) {
		
		window.requestAnimationFrame(cycle);
		
		let time = Date.now(),
			dTime = time - startTime;
		
		if(dTime >= frameRate) {

			startTime = time;
			
			cycleFunctions.forEach(a=>{
				a.dTime += frameRate;
				a.time += frameRate;
				if(a.dTime >= a.rate) {
					a.func(a.time);
					a.dTime = 0;
				}
			});
			
			let arr = [];

			delayFunctions.forEach(a=>{
				a.dTime += frameRate;
				if(a.dTime >= a.delay) {
					a.func();
				} else {
					arr.push(a.func);
				}
			});

			delayFunctions = arr;
		}
	}
}

module.exports = {
	start: function() {
		startTime = Date.now();
		active = true;
		window.requestAnimationFrame(cycle);
	},
	stop: function() {
		active = false;
	},
	setFrameRate: function(rate) {
		frameRate = rate / 1000;
	},
	add: function(func, rate ) {
		if(!!rate)
			rate = rate / 1000;
		cycleFunctions.push({
			func: func,
			dTime: 0,
			time: 0,
			rate: rate || frameRate
		});
	},
	remove: function(func){
		let arr = [];
		cycleFunctions.forEach(cycleFunc=>{
			if(func !== cycleFunc.func) {
				arr.push(cycleFunc);
			}
		});
		cycleFunctions = arr;
	},
	delay: function(func, delay, log) {
		delayFunctions.push({func:func, dTime:0, delay:delay});
	},
	cancelDelay: function(func) {
		let arr = [];
		delayFunctions.forEach(funcObj=>{ 
			if(funcObj.func !== func) {
				arr.push(funcObj);
			}
		});
		delayFunctions = arr;
	}
};
},{}],2:[function(require,module,exports){
'use strict';

function DisplayObject() {
	this._node = null;
}

Object.defineProperties(DisplayObject.prototype, {
	'x': {
		get: function(){
			if(!!this._x)
				return this._x;
			return this.x = 0;
		},
		set: function(a){
			this._x = a;
		}
	},
	'y': {
		get: function(){
			if(!!this._y)
				return this._y;
			return this.y = 0;
		},
		set: function(a){
			this._y = a;
		}
	},
	'z': {
		get: function(){
			if(!!this._z)
				return this._z;
			return this.z = 0;
		},
		set: function(a){
			this._z = a;
		}
	},
	'addChild': {
		value:function(a){
			if(!!this._node) {
				this._node.appendChild(a.node);
				a.parent = this;
			}
		}
	},
	'node': {
		get: function() {
			return this._node;
		}
	},
	'parent': {
		set: function(a){
			this._parent = a;
		},
		get: function(){
			return this._parent;
		}
	}
});

module.exports = DisplayObject;
},{}],3:[function(require,module,exports){
'use strict';

let DisplayObject = require('./displayObject');

function Graphics() {
	DisplayObject.prototype.constructor.call(this);
	this._node = this._canvas = document.createElement('canvas');
	this._canvas.style.zIndex = 0;
	this._canvas.style.position = 'absolute';
	this._canvas.style.transform = 'translate(0, 0)';
	this._context = this._canvas.getContext('2d');
}

Graphics.prototype = Object.create(DisplayObject.prototype, {
	'setXPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			//console.log(t);
			t = t.replace(/translateX(.+)/, '') + ' translateX(' + a + 'px)';
			//console.log(t);
			this._canvas.style.transform = t.trim();
		}
	},
	'setYPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			t = t.replace(/translateY(.+)/, '') + ' translateY(' + a + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'setZPosition': {
		value: function(a) {
			this._canvas.style.zIndex = z;
		}
	},
	'setWidth': {
		value: function(a) {
			this._canvas.setAttribute('width', a + 'px');
		}
	},
	'setHeight': {
		value: function(a) {
			this._canvas.setAttribute('height', a + 'px');
		}
	},
	'drawImage': {
		value: function(a) {
			this._canvas.width = a.width + 'px';
			this._canvas.height = a.height + 'px';
			this._context.clearRect(0, 0, this.width, this.height);
			this._context.drawImage(
				a, 
				0, 
				0, 
				this._canvas.width, 
				this._canvas.height,
				0,
				0, 
				this._canvas.width, 
				this._canvas.height);
		}
	},
	'fillStyle': {
		set: function(a) {
			this._context.fillStyle = a;
		}
	},
	'drawRect': {
		value: function(a, b, c, d) {
			this._context.fillRect(a, b, c, d);
		}
	}
});

module.exports = Graphics;
},{"./displayObject":2}],4:[function(require,module,exports){
'use strict';

let Graphics = require('./graphics'),
	DisplayObject = require('./displayObject'),
	sprites = [],
	availableSprites = Object.create(null);

function Sprite() {
	DisplayObject.prototype.constructor.call(this);
	sprites.push(this);
	this._graphics = new Graphics();
}

Sprite.prototype = Object.create(DisplayObject.prototype, {
	'x': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').get.call(this);
		},
		set: function(a){
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, a);
			this._graphics.setXPosition(a);
		}
	},
	'y': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').get.call(this);
		},
		set: function(a){
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, a);
			this._graphics.setYPosition(a);
		}
	},
	'z': {
		get: function(){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'z').get.call(this);
		},
		set: function(a){
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'z').set.call(this, a);
			this._graphics.setZPosition(a);
		}
	},
	'node': {
		get: function() {
			return this._graphics.node;
		}
	},
	'graphics': {
		get: function() {
			return this._graphics;
		}
	}
});

module.exports = Sprite;
},{"./displayObject":2,"./graphics":3}],5:[function(require,module,exports){
'use strict';

let cycle = require('./cycle');

let easeFunctions = {
	linear: function(t, b, c, d) {
		return c * t / d + b;
	},
	easeInQuad: function(t, b, c, d) {
		t /= d;
		return c*t*t+b;
	},
	easeOutQuad: function(t, b, c, d) {
		t /= d;
		return -c * t * ( t - 2 ) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
}


module.exports = function(obj, props, time, ease){
	let key = null,
		start = null,
		end = null,
		delta = null,
		easeObj = {};
	for(key in props) {
		start = obj[key];
		end = props[key];
		delta = end - start;
		easeObj[key] = {
			start: start,
			delta: delta,
			elapsedTime: 0,
			time: time
		};
	}

	let tweenFunc = function(dTime){
		if(dTime > time) {
			dTime = time;
		}
		for(key in props) {
			easeObj[key].elapsedTime = dTime;
			obj[key] = easeFunctions[ease](easeObj[key].elapsedTime, easeObj[key].start, easeObj[key].delta, easeObj[key].time);
		}
		if(dTime === time) {

			cycle.remove(tweenFunc);
		}

	}

	cycle.add(tweenFunc);
};
},{"./cycle":1}],6:[function(require,module,exports){
'use strict';

let DisplayObject = require('./display/sprite');

function Viewport(root, width, height, background) {
	DisplayObject.prototype.constructor.call(this);
	
	this._node = root;
	root.style.width = width;
	root.style.height = height;
	root.style.background = background;
}

Viewport.prototype = Object.create(DisplayObject.prototype);

module.exports = Viewport;
},{"./display/sprite":4}],7:[function(require,module,exports){
'use strict';

window.wowee = (function(){
	
	let Sprite = require('./lib/display/sprite'),
		Viewport = require('./lib/viewport'),
		viewport = null,
		cycle = require('./lib/cycle'),
		tween = require('./lib/tween');
	
	return function(config) {
		var root_element = config.root || document.body,
			stage_width = config.width || '100%',
			stage_height = config.height || '100%';
		
		viewport = new Viewport(root_element, stage_width, stage_height, config.background || 'white');
		cycle.setFrameRate(30);
		cycle.start();
		
		return {
			
			createSprite: function() {
				return new Sprite();
			},
			
			addToViewport: function(displayObject) {
				viewport.addChild(displayObject);
			},

			tween: function(obj, props, time, ease) {
				tween(obj, props, time, ease);
			}
			
		}
	}
	
}());
},{"./lib/cycle":1,"./lib/display/sprite":4,"./lib/tween":5,"./lib/viewport":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY3ljbGUuanMiLCJsaWIvZGlzcGxheS9kaXNwbGF5T2JqZWN0LmpzIiwibGliL2Rpc3BsYXkvZ3JhcGhpY3MuanMiLCJsaWIvZGlzcGxheS9zcHJpdGUuanMiLCJsaWIvdHdlZW4uanMiLCJsaWIvdmlld3BvcnQuanMiLCJ3b3dlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxubGV0IGN5Y2xlRnVuY3Rpb25zID0gbmV3IEFycmF5KCksXG5cdGRlbGF5RnVuY3Rpb25zID0gbmV3IEFycmF5KCksXG5cdGFjdGl2ZSA9IGZhbHNlLFxuXHRmcmFtZVJhdGUgPSAxLFxuXHRzdGFydFRpbWUgPSAwO1xuXG5mdW5jdGlvbiBjeWNsZSgpIHtcblxuXG5cblx0aWYoYWN0aXZlKSB7XG5cdFx0XG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjeWNsZSk7XG5cdFx0XG5cdFx0bGV0IHRpbWUgPSBEYXRlLm5vdygpLFxuXHRcdFx0ZFRpbWUgPSB0aW1lIC0gc3RhcnRUaW1lO1xuXHRcdFxuXHRcdGlmKGRUaW1lID49IGZyYW1lUmF0ZSkge1xuXG5cdFx0XHRzdGFydFRpbWUgPSB0aW1lO1xuXHRcdFx0XG5cdFx0XHRjeWNsZUZ1bmN0aW9ucy5mb3JFYWNoKGE9Pntcblx0XHRcdFx0YS5kVGltZSArPSBmcmFtZVJhdGU7XG5cdFx0XHRcdGEudGltZSArPSBmcmFtZVJhdGU7XG5cdFx0XHRcdGlmKGEuZFRpbWUgPj0gYS5yYXRlKSB7XG5cdFx0XHRcdFx0YS5mdW5jKGEudGltZSk7XG5cdFx0XHRcdFx0YS5kVGltZSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRsZXQgYXJyID0gW107XG5cblx0XHRcdGRlbGF5RnVuY3Rpb25zLmZvckVhY2goYT0+e1xuXHRcdFx0XHRhLmRUaW1lICs9IGZyYW1lUmF0ZTtcblx0XHRcdFx0aWYoYS5kVGltZSA+PSBhLmRlbGF5KSB7XG5cdFx0XHRcdFx0YS5mdW5jKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YXJyLnB1c2goYS5mdW5jKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGRlbGF5RnVuY3Rpb25zID0gYXJyO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RhcnQ6IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cdFx0YWN0aXZlID0gdHJ1ZTtcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGN5Y2xlKTtcblx0fSxcblx0c3RvcDogZnVuY3Rpb24oKSB7XG5cdFx0YWN0aXZlID0gZmFsc2U7XG5cdH0sXG5cdHNldEZyYW1lUmF0ZTogZnVuY3Rpb24ocmF0ZSkge1xuXHRcdGZyYW1lUmF0ZSA9IHJhdGUgLyAxMDAwO1xuXHR9LFxuXHRhZGQ6IGZ1bmN0aW9uKGZ1bmMsIHJhdGUgKSB7XG5cdFx0aWYoISFyYXRlKVxuXHRcdFx0cmF0ZSA9IHJhdGUgLyAxMDAwO1xuXHRcdGN5Y2xlRnVuY3Rpb25zLnB1c2goe1xuXHRcdFx0ZnVuYzogZnVuYyxcblx0XHRcdGRUaW1lOiAwLFxuXHRcdFx0dGltZTogMCxcblx0XHRcdHJhdGU6IHJhdGUgfHwgZnJhbWVSYXRlXG5cdFx0fSk7XG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24oZnVuYyl7XG5cdFx0bGV0IGFyciA9IFtdO1xuXHRcdGN5Y2xlRnVuY3Rpb25zLmZvckVhY2goY3ljbGVGdW5jPT57XG5cdFx0XHRpZihmdW5jICE9PSBjeWNsZUZ1bmMuZnVuYykge1xuXHRcdFx0XHRhcnIucHVzaChjeWNsZUZ1bmMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGN5Y2xlRnVuY3Rpb25zID0gYXJyO1xuXHR9LFxuXHRkZWxheTogZnVuY3Rpb24oZnVuYywgZGVsYXksIGxvZykge1xuXHRcdGRlbGF5RnVuY3Rpb25zLnB1c2goe2Z1bmM6ZnVuYywgZFRpbWU6MCwgZGVsYXk6ZGVsYXl9KTtcblx0fSxcblx0Y2FuY2VsRGVsYXk6IGZ1bmN0aW9uKGZ1bmMpIHtcblx0XHRsZXQgYXJyID0gW107XG5cdFx0ZGVsYXlGdW5jdGlvbnMuZm9yRWFjaChmdW5jT2JqPT57IFxuXHRcdFx0aWYoZnVuY09iai5mdW5jICE9PSBmdW5jKSB7XG5cdFx0XHRcdGFyci5wdXNoKGZ1bmNPYmopO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGRlbGF5RnVuY3Rpb25zID0gYXJyO1xuXHR9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gRGlzcGxheU9iamVjdCgpIHtcblx0dGhpcy5fbm9kZSA9IG51bGw7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKERpc3BsYXlPYmplY3QucHJvdG90eXBlLCB7XG5cdCd4Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3g7XG5cdFx0XHRyZXR1cm4gdGhpcy54ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl94ID0gYTtcblx0XHR9XG5cdH0sXG5cdCd5Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feSlcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3k7XG5cdFx0XHRyZXR1cm4gdGhpcy55ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl95ID0gYTtcblx0XHR9XG5cdH0sXG5cdCd6Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feilcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3o7XG5cdFx0XHRyZXR1cm4gdGhpcy56ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl96ID0gYTtcblx0XHR9XG5cdH0sXG5cdCdhZGRDaGlsZCc6IHtcblx0XHR2YWx1ZTpmdW5jdGlvbihhKXtcblx0XHRcdGlmKCEhdGhpcy5fbm9kZSkge1xuXHRcdFx0XHR0aGlzLl9ub2RlLmFwcGVuZENoaWxkKGEubm9kZSk7XG5cdFx0XHRcdGEucGFyZW50ID0gdGhpcztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdCdub2RlJzoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbm9kZTtcblx0XHR9XG5cdH0sXG5cdCdwYXJlbnQnOiB7XG5cdFx0c2V0OiBmdW5jdGlvbihhKXtcblx0XHRcdHRoaXMuX3BhcmVudCA9IGE7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcGFyZW50O1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheU9iamVjdDsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZSgnLi9kaXNwbGF5T2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIEdyYXBoaWNzKCkge1xuXHREaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXHR0aGlzLl9ub2RlID0gdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdHRoaXMuX2NhbnZhcy5zdHlsZS56SW5kZXggPSAwO1xuXHR0aGlzLl9jYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHR0aGlzLl9jYW52YXMuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwLCAwKSc7XG5cdHRoaXMuX2NvbnRleHQgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuR3JhcGhpY3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwge1xuXHQnc2V0WFBvc2l0aW9uJzoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRsZXQgdCA9IHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2Zvcm07XG5cdFx0XHQvL2NvbnNvbGUubG9nKHQpO1xuXHRcdFx0dCA9IHQucmVwbGFjZSgvdHJhbnNsYXRlWCguKykvLCAnJykgKyAnIHRyYW5zbGF0ZVgoJyArIGEgKyAncHgpJztcblx0XHRcdC8vY29uc29sZS5sb2codCk7XG5cdFx0XHR0aGlzLl9jYW52YXMuc3R5bGUudHJhbnNmb3JtID0gdC50cmltKCk7XG5cdFx0fVxuXHR9LFxuXHQnc2V0WVBvc2l0aW9uJzoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRsZXQgdCA9IHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2Zvcm07XG5cdFx0XHR0ID0gdC5yZXBsYWNlKC90cmFuc2xhdGVZKC4rKS8sICcnKSArICcgdHJhbnNsYXRlWSgnICsgYSArICdweCknO1xuXHRcdFx0dGhpcy5fY2FudmFzLnN0eWxlLnRyYW5zZm9ybSA9IHQudHJpbSgpO1xuXHRcdH1cblx0fSxcblx0J3NldFpQb3NpdGlvbic6IHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oYSkge1xuXHRcdFx0dGhpcy5fY2FudmFzLnN0eWxlLnpJbmRleCA9IHo7XG5cdFx0fVxuXHR9LFxuXHQnc2V0V2lkdGgnOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgYSArICdweCcpO1xuXHRcdH1cblx0fSxcblx0J3NldEhlaWdodCc6IHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oYSkge1xuXHRcdFx0dGhpcy5fY2FudmFzLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgYSArICdweCcpO1xuXHRcdH1cblx0fSxcblx0J2RyYXdJbWFnZSc6IHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oYSkge1xuXHRcdFx0dGhpcy5fY2FudmFzLndpZHRoID0gYS53aWR0aCArICdweCc7XG5cdFx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0ID0gYS5oZWlnaHQgKyAncHgnO1xuXHRcdFx0dGhpcy5fY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdFx0dGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoXG5cdFx0XHRcdGEsIFxuXHRcdFx0XHQwLCBcblx0XHRcdFx0MCwgXG5cdFx0XHRcdHRoaXMuX2NhbnZhcy53aWR0aCwgXG5cdFx0XHRcdHRoaXMuX2NhbnZhcy5oZWlnaHQsXG5cdFx0XHRcdDAsXG5cdFx0XHRcdDAsIFxuXHRcdFx0XHR0aGlzLl9jYW52YXMud2lkdGgsIFxuXHRcdFx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0KTtcblx0XHR9XG5cdH0sXG5cdCdmaWxsU3R5bGUnOiB7XG5cdFx0c2V0OiBmdW5jdGlvbihhKSB7XG5cdFx0XHR0aGlzLl9jb250ZXh0LmZpbGxTdHlsZSA9IGE7XG5cdFx0fVxuXHR9LFxuXHQnZHJhd1JlY3QnOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcblx0XHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoYSwgYiwgYywgZCk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmFwaGljczsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBHcmFwaGljcyA9IHJlcXVpcmUoJy4vZ3JhcGhpY3MnKSxcblx0RGlzcGxheU9iamVjdCA9IHJlcXVpcmUoJy4vZGlzcGxheU9iamVjdCcpLFxuXHRzcHJpdGVzID0gW10sXG5cdGF2YWlsYWJsZVNwcml0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5mdW5jdGlvbiBTcHJpdGUoKSB7XG5cdERpc3BsYXlPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG5cdHNwcml0ZXMucHVzaCh0aGlzKTtcblx0dGhpcy5fZ3JhcGhpY3MgPSBuZXcgR3JhcGhpY3MoKTtcbn1cblxuU3ByaXRlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlzcGxheU9iamVjdC5wcm90b3R5cGUsIHtcblx0J3gnOiB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd4JykuZ2V0LmNhbGwodGhpcyk7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uKGEpe1xuXHRcdFx0T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3gnKS5zZXQuY2FsbCh0aGlzLCBhKTtcblx0XHRcdHRoaXMuX2dyYXBoaWNzLnNldFhQb3NpdGlvbihhKTtcblx0XHR9XG5cdH0sXG5cdCd5Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKERpc3BsYXlPYmplY3QucHJvdG90eXBlLCAneScpLmdldC5jYWxsKHRoaXMpO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbihhKXtcblx0XHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRGlzcGxheU9iamVjdC5wcm90b3R5cGUsICd4Jykuc2V0LmNhbGwodGhpcywgYSk7XG5cdFx0XHR0aGlzLl9ncmFwaGljcy5zZXRZUG9zaXRpb24oYSk7XG5cdFx0fVxuXHR9LFxuXHQneic6IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3onKS5nZXQuY2FsbCh0aGlzKTtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwgJ3onKS5zZXQuY2FsbCh0aGlzLCBhKTtcblx0XHRcdHRoaXMuX2dyYXBoaWNzLnNldFpQb3NpdGlvbihhKTtcblx0XHR9XG5cdH0sXG5cdCdub2RlJzoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ3JhcGhpY3Mubm9kZTtcblx0XHR9XG5cdH0sXG5cdCdncmFwaGljcyc6IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2dyYXBoaWNzO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IGN5Y2xlID0gcmVxdWlyZSgnLi9jeWNsZScpO1xuXG5sZXQgZWFzZUZ1bmN0aW9ucyA9IHtcblx0bGluZWFyOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMgKiB0IC8gZCArIGI7XG5cdH0sXG5cdGVhc2VJblF1YWQ6IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcblx0XHR0IC89IGQ7XG5cdFx0cmV0dXJuIGMqdCp0K2I7XG5cdH0sXG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XG5cdFx0dCAvPSBkO1xuXHRcdHJldHVybiAtYyAqIHQgKiAoIHQgLSAyICkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0ICsgYjtcblx0XHRyZXR1cm4gLWMvMiAqICgoLS10KSoodC0yKSAtIDEpICsgYjtcblx0fSxcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqdCArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XG5cdFx0cmV0dXJuIGMvMiooKHQtPTIpKnQqdCArIDIpICsgYjtcblx0fSxcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMqKHQvPWQpKnQqdCp0ICsgYjtcblx0fSxcblx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dFF1YXJ0OiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCArIGI7XG5cdFx0cmV0dXJuIC1jLzIgKiAoKHQtPTIpKnQqdCp0IC0gMikgKyBiO1xuXHR9LFxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyoodC89ZCkqdCp0KnQqdCArIGI7XG5cdH0sXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyooKHQ9dC9kLTEpKnQqdCp0KnQgKyAxKSArIGI7XG5cdH0sXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCp0KnQqdCArIDIpICsgYjtcblx0fSxcblx0ZWFzZUluU2luZTogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gLWMgKiBNYXRoLmNvcyh0L2QgKiAoTWF0aC5QSS8yKSkgKyBjICsgYjtcblx0fSxcblx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIGMgKiBNYXRoLnNpbih0L2QgKiAoTWF0aC5QSS8yKSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdHJldHVybiAtYy8yICogKE1hdGguY29zKE1hdGguUEkqdC9kKSAtIDEpICsgYjtcblx0fSxcblx0ZWFzZUluRXhwbzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gKHQ9PTApID8gYiA6IGMgKiBNYXRoLnBvdygyLCAxMCAqICh0L2QgLSAxKSkgKyBiO1xuXHR9LFxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gKHQ9PWQpID8gYitjIDogYyAqICgtTWF0aC5wb3coMiwgLTEwICogdC9kKSArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7XG5cdFx0aWYgKHQ9PWQpIHJldHVybiBiK2M7XG5cdFx0aWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMiAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSkgKyBiO1xuXHRcdHJldHVybiBjLzIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tdCkgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJbkNpcmM6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0cmV0dXJuIC1jICogKE1hdGguc3FydCgxIC0gKHQvPWQpKnQpIC0gMSkgKyBiO1xuXHR9LFxuXHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyAqIE1hdGguc3FydCgxIC0gKHQ9dC9kLTEpKnQpICsgYjtcblx0fSxcblx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gLWMvMiAqIChNYXRoLnNxcnQoMSAtIHQqdCkgLSAxKSArIGI7XG5cdFx0cmV0dXJuIGMvMiAqIChNYXRoLnNxcnQoMSAtICh0LT0yKSp0KSArIDEpICsgYjtcblx0fSxcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9Yztcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQpPT0xKSByZXR1cm4gYitjOyAgaWYgKCFwKSBwPWQqLjM7XG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkgeyBhPWM7IHZhciBzPXAvNDsgfVxuXHRcdGVsc2UgdmFyIHMgPSBwLygyKk1hdGguUEkpICogTWF0aC5hc2luIChjL2EpO1xuXHRcdHJldHVybiAtKGEqTWF0aC5wb3coMiwxMCoodC09MSkpICogTWF0aC5zaW4oICh0KmQtcykqKDIqTWF0aC5QSSkvcCApKSArIGI7XG5cdH0sXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRcdHZhciBzPTEuNzAxNTg7dmFyIHA9MDt2YXIgYT1jO1xuXHRcdGlmICh0PT0wKSByZXR1cm4gYjsgIGlmICgodC89ZCk9PTEpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCouMztcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XG5cdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XG5cdFx0cmV0dXJuIGEqTWF0aC5wb3coMiwtMTAqdCkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkgKyBjICsgYjtcblx0fSxcblx0ZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHR2YXIgcz0xLjcwMTU4O3ZhciBwPTA7dmFyIGE9Yztcblx0XHRpZiAodD09MCkgcmV0dXJuIGI7ICBpZiAoKHQvPWQvMik9PTIpIHJldHVybiBiK2M7ICBpZiAoIXApIHA9ZCooLjMqMS41KTtcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7IGE9YzsgdmFyIHM9cC80OyB9XG5cdFx0ZWxzZSB2YXIgcyA9IHAvKDIqTWF0aC5QSSkgKiBNYXRoLmFzaW4gKGMvYSk7XG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41KihhKk1hdGgucG93KDIsMTAqKHQtPTEpKSAqIE1hdGguc2luKCAodCpkLXMpKigyKk1hdGguUEkpL3AgKSkgKyBiO1xuXHRcdHJldHVybiBhKk1hdGgucG93KDIsLTEwKih0LT0xKSkgKiBNYXRoLnNpbiggKHQqZC1zKSooMipNYXRoLlBJKS9wICkqLjUgKyBjICsgYjtcblx0fSxcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gKHQsIGIsIGMsIGQsIHMpIHtcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuXHRcdHJldHVybiBjKih0Lz1kKSp0KigocysxKSp0IC0gcykgKyBiO1xuXHR9LFxuXHRlYXNlT3V0QmFjazogZnVuY3Rpb24gKHQsIGIsIGMsIGQsIHMpIHtcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xuXHRcdHJldHVybiBjKigodD10L2QtMSkqdCooKHMrMSkqdCArIHMpICsgMSkgKyBiO1xuXHR9LFxuXHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAodCwgYiwgYywgZCwgcykge1xuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7IFxuXHRcdGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqKHQqdCooKChzKj0oMS41MjUpKSsxKSp0IC0gcykpICsgYjtcblx0XHRyZXR1cm4gYy8yKigodC09MikqdCooKChzKj0oMS41MjUpKSsxKSp0ICsgcykgKyAyKSArIGI7XG5cdH0sXG5cdGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0XHRyZXR1cm4gYyAtIGpRdWVyeS5lYXNpbmcuZWFzZU91dEJvdW5jZSAoZC10LCAwLCBjLCBkKSArIGI7XG5cdH0sXG5cdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKCh0Lz1kKSA8ICgxLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1KnQqdCkgKyBiO1xuXHRcdH0gZWxzZSBpZiAodCA8ICgyLzIuNzUpKSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMS41LzIuNzUpKSp0ICsgLjc1KSArIGI7XG5cdFx0fSBlbHNlIGlmICh0IDwgKDIuNS8yLjc1KSkge1xuXHRcdFx0cmV0dXJuIGMqKDcuNTYyNSoodC09KDIuMjUvMi43NSkpKnQgKyAuOTM3NSkgKyBiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYyooNy41NjI1Kih0LT0oMi42MjUvMi43NSkpKnQgKyAuOTg0Mzc1KSArIGI7XG5cdFx0fVxuXHR9LFxuXHRlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdFx0aWYgKHQgPCBkLzIpIHJldHVybiBqUXVlcnkuZWFzaW5nLmVhc2VJbkJvdW5jZSAodCoyLCAwLCBjLCBkKSAqIC41ICsgYjtcblx0XHRyZXR1cm4galF1ZXJ5LmVhc2luZy5lYXNlT3V0Qm91bmNlICh0KjItZCwgMCwgYywgZCkgKiAuNSArIGMqLjUgKyBiO1xuXHR9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIHByb3BzLCB0aW1lLCBlYXNlKXtcblx0bGV0IGtleSA9IG51bGwsXG5cdFx0c3RhcnQgPSBudWxsLFxuXHRcdGVuZCA9IG51bGwsXG5cdFx0ZGVsdGEgPSBudWxsLFxuXHRcdGVhc2VPYmogPSB7fTtcblx0Zm9yKGtleSBpbiBwcm9wcykge1xuXHRcdHN0YXJ0ID0gb2JqW2tleV07XG5cdFx0ZW5kID0gcHJvcHNba2V5XTtcblx0XHRkZWx0YSA9IGVuZCAtIHN0YXJ0O1xuXHRcdGVhc2VPYmpba2V5XSA9IHtcblx0XHRcdHN0YXJ0OiBzdGFydCxcblx0XHRcdGRlbHRhOiBkZWx0YSxcblx0XHRcdGVsYXBzZWRUaW1lOiAwLFxuXHRcdFx0dGltZTogdGltZVxuXHRcdH07XG5cdH1cblxuXHRsZXQgdHdlZW5GdW5jID0gZnVuY3Rpb24oZFRpbWUpe1xuXHRcdGlmKGRUaW1lID4gdGltZSkge1xuXHRcdFx0ZFRpbWUgPSB0aW1lO1xuXHRcdH1cblx0XHRmb3Ioa2V5IGluIHByb3BzKSB7XG5cdFx0XHRlYXNlT2JqW2tleV0uZWxhcHNlZFRpbWUgPSBkVGltZTtcblx0XHRcdG9ialtrZXldID0gZWFzZUZ1bmN0aW9uc1tlYXNlXShlYXNlT2JqW2tleV0uZWxhcHNlZFRpbWUsIGVhc2VPYmpba2V5XS5zdGFydCwgZWFzZU9ialtrZXldLmRlbHRhLCBlYXNlT2JqW2tleV0udGltZSk7XG5cdFx0fVxuXHRcdGlmKGRUaW1lID09PSB0aW1lKSB7XG5cblx0XHRcdGN5Y2xlLnJlbW92ZSh0d2VlbkZ1bmMpO1xuXHRcdH1cblxuXHR9XG5cblx0Y3ljbGUuYWRkKHR3ZWVuRnVuYyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubGV0IERpc3BsYXlPYmplY3QgPSByZXF1aXJlKCcuL2Rpc3BsYXkvc3ByaXRlJyk7XG5cbmZ1bmN0aW9uIFZpZXdwb3J0KHJvb3QsIHdpZHRoLCBoZWlnaHQsIGJhY2tncm91bmQpIHtcblx0RGlzcGxheU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcblx0XG5cdHRoaXMuX25vZGUgPSByb290O1xuXHRyb290LnN0eWxlLndpZHRoID0gd2lkdGg7XG5cdHJvb3Quc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRyb290LnN0eWxlLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xufVxuXG5WaWV3cG9ydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3cG9ydDsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy53b3dlZSA9IChmdW5jdGlvbigpe1xuXHRcblx0bGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vbGliL2Rpc3BsYXkvc3ByaXRlJyksXG5cdFx0Vmlld3BvcnQgPSByZXF1aXJlKCcuL2xpYi92aWV3cG9ydCcpLFxuXHRcdHZpZXdwb3J0ID0gbnVsbCxcblx0XHRjeWNsZSA9IHJlcXVpcmUoJy4vbGliL2N5Y2xlJyksXG5cdFx0dHdlZW4gPSByZXF1aXJlKCcuL2xpYi90d2VlbicpO1xuXHRcblx0cmV0dXJuIGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdHZhciByb290X2VsZW1lbnQgPSBjb25maWcucm9vdCB8fCBkb2N1bWVudC5ib2R5LFxuXHRcdFx0c3RhZ2Vfd2lkdGggPSBjb25maWcud2lkdGggfHwgJzEwMCUnLFxuXHRcdFx0c3RhZ2VfaGVpZ2h0ID0gY29uZmlnLmhlaWdodCB8fCAnMTAwJSc7XG5cdFx0XG5cdFx0dmlld3BvcnQgPSBuZXcgVmlld3BvcnQocm9vdF9lbGVtZW50LCBzdGFnZV93aWR0aCwgc3RhZ2VfaGVpZ2h0LCBjb25maWcuYmFja2dyb3VuZCB8fCAnd2hpdGUnKTtcblx0XHRjeWNsZS5zZXRGcmFtZVJhdGUoMzApO1xuXHRcdGN5Y2xlLnN0YXJ0KCk7XG5cdFx0XG5cdFx0cmV0dXJuIHtcblx0XHRcdFxuXHRcdFx0Y3JlYXRlU3ByaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBTcHJpdGUoKTtcblx0XHRcdH0sXG5cdFx0XHRcblx0XHRcdGFkZFRvVmlld3BvcnQ6IGZ1bmN0aW9uKGRpc3BsYXlPYmplY3QpIHtcblx0XHRcdFx0dmlld3BvcnQuYWRkQ2hpbGQoZGlzcGxheU9iamVjdCk7XG5cdFx0XHR9LFxuXG5cdFx0XHR0d2VlbjogZnVuY3Rpb24ob2JqLCBwcm9wcywgdGltZSwgZWFzZSkge1xuXHRcdFx0XHR0d2VlbihvYmosIHByb3BzLCB0aW1lLCBlYXNlKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH1cblx0fVxuXHRcbn0oKSk7Il19

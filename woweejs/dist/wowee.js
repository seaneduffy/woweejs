(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function DisplayObject() {
	this._node = null;
}

Object.defineProperties(DisplayObject.prototype, {
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
},{}],2:[function(require,module,exports){
'use strict';

let DisplayObject = require('./displayObject');

function Graphics() {
	DisplayObject.prototype.constructor.call(this);
	this._node = this._canvas = document.createElement('canvas');
	this._canvas.style.zIndex = 0;
	this._canvas.style.position = 'absolute';
	this._canvas.style.transform = 'translate(0, 0)';
	this._canvas.style.transition = 'transform 10ms linear';
	this._context = this._canvas.getContext('2d');
}

Graphics.prototype = Object.create(DisplayObject.prototype, {
	'setXPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			//console.log(t);
			t = t.replace(/translateX(d+px)/, '') + ' translateX(' + a + 'px)';
			//console.log(t);
			this._canvas.style.transform = t.trim();
		}
	},
	'setYPosition': {
		value: function(a) {
			let t = this._canvas.style.transform;
			t = t.replace(/translateY(d+px)/, '') + ' translateY(' + a + 'px)';
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
},{"./displayObject":1}],3:[function(require,module,exports){
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
			if(!!this._x)
				return this._x;
			return this.x = 0;
		},
		set: function(a){
			this._x = a;
			this._graphics.setXPosition(a);
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
			this._graphics.setYPosition(a);
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
},{"./displayObject":1,"./graphics":2}],4:[function(require,module,exports){
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
},{"./display/sprite":3}],5:[function(require,module,exports){
'use strict';

window.wowee = (function(){
	
	let Sprite = require('./lib/display/sprite'),
		Viewport = require('./lib/viewport'),
		viewport = null;
	
	return function(config) {
		var root_element = config.root || document.body,
			stage_width = config.width || '100%',
			stage_height = config.height || '100%';
		
		viewport = new Viewport(root_element, stage_width, stage_height, config.background || 'white');
		
		return {
			
			createSprite: function() {
				return new Sprite();
			},
			
			addToViewport: function(a) {
				viewport.addChild(a);
			}
			
		}
	}
	
}());
},{"./lib/display/sprite":3,"./lib/viewport":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvZGlzcGxheS9kaXNwbGF5T2JqZWN0LmpzIiwibGliL2Rpc3BsYXkvZ3JhcGhpY3MuanMiLCJsaWIvZGlzcGxheS9zcHJpdGUuanMiLCJsaWIvdmlld3BvcnQuanMiLCJ3b3dlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gRGlzcGxheU9iamVjdCgpIHtcblx0dGhpcy5fbm9kZSA9IG51bGw7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKERpc3BsYXlPYmplY3QucHJvdG90eXBlLCB7XG5cdCdhZGRDaGlsZCc6IHtcblx0XHR2YWx1ZTpmdW5jdGlvbihhKXtcblx0XHRcdGlmKCEhdGhpcy5fbm9kZSkge1xuXHRcdFx0XHR0aGlzLl9ub2RlLmFwcGVuZENoaWxkKGEubm9kZSk7XG5cdFx0XHRcdGEucGFyZW50ID0gdGhpcztcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdCdub2RlJzoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbm9kZTtcblx0XHR9XG5cdH0sXG5cdCdwYXJlbnQnOiB7XG5cdFx0c2V0OiBmdW5jdGlvbihhKXtcblx0XHRcdHRoaXMuX3BhcmVudCA9IGE7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcGFyZW50O1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheU9iamVjdDsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZSgnLi9kaXNwbGF5T2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIEdyYXBoaWNzKCkge1xuXHREaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXHR0aGlzLl9ub2RlID0gdGhpcy5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdHRoaXMuX2NhbnZhcy5zdHlsZS56SW5kZXggPSAwO1xuXHR0aGlzLl9jYW52YXMuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHR0aGlzLl9jYW52YXMuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgwLCAwKSc7XG5cdHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2l0aW9uID0gJ3RyYW5zZm9ybSAxMG1zIGxpbmVhcic7XG5cdHRoaXMuX2NvbnRleHQgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbn1cblxuR3JhcGhpY3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSwge1xuXHQnc2V0WFBvc2l0aW9uJzoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRsZXQgdCA9IHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2Zvcm07XG5cdFx0XHQvL2NvbnNvbGUubG9nKHQpO1xuXHRcdFx0dCA9IHQucmVwbGFjZSgvdHJhbnNsYXRlWChkK3B4KS8sICcnKSArICcgdHJhbnNsYXRlWCgnICsgYSArICdweCknO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyh0KTtcblx0XHRcdHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2Zvcm0gPSB0LnRyaW0oKTtcblx0XHR9XG5cdH0sXG5cdCdzZXRZUG9zaXRpb24nOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdGxldCB0ID0gdGhpcy5fY2FudmFzLnN0eWxlLnRyYW5zZm9ybTtcblx0XHRcdHQgPSB0LnJlcGxhY2UoL3RyYW5zbGF0ZVkoZCtweCkvLCAnJykgKyAnIHRyYW5zbGF0ZVkoJyArIGEgKyAncHgpJztcblx0XHRcdHRoaXMuX2NhbnZhcy5zdHlsZS50cmFuc2Zvcm0gPSB0LnRyaW0oKTtcblx0XHR9XG5cdH0sXG5cdCdzZXRaUG9zaXRpb24nOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdHRoaXMuX2NhbnZhcy5zdHlsZS56SW5kZXggPSB6O1xuXHRcdH1cblx0fSxcblx0J3NldFdpZHRoJzoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHR0aGlzLl9jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGEgKyAncHgnKTtcblx0XHR9XG5cdH0sXG5cdCdzZXRIZWlnaHQnOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdHRoaXMuX2NhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGEgKyAncHgnKTtcblx0XHR9XG5cdH0sXG5cdCdkcmF3SW1hZ2UnOiB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdHRoaXMuX2NhbnZhcy53aWR0aCA9IGEud2lkdGggKyAncHgnO1xuXHRcdFx0dGhpcy5fY2FudmFzLmhlaWdodCA9IGEuaGVpZ2h0ICsgJ3B4Jztcblx0XHRcdHRoaXMuX2NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHRcdHRoaXMuX2NvbnRleHQuZHJhd0ltYWdlKFxuXHRcdFx0XHRhLCBcblx0XHRcdFx0MCwgXG5cdFx0XHRcdDAsIFxuXHRcdFx0XHR0aGlzLl9jYW52YXMud2lkdGgsIFxuXHRcdFx0XHR0aGlzLl9jYW52YXMuaGVpZ2h0LFxuXHRcdFx0XHQwLFxuXHRcdFx0XHQwLCBcblx0XHRcdFx0dGhpcy5fY2FudmFzLndpZHRoLCBcblx0XHRcdFx0dGhpcy5fY2FudmFzLmhlaWdodCk7XG5cdFx0fVxuXHR9LFxuXHQnZmlsbFN0eWxlJzoge1xuXHRcdHNldDogZnVuY3Rpb24oYSkge1xuXHRcdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBhO1xuXHRcdH1cblx0fSxcblx0J2RyYXdSZWN0Jzoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG5cdFx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KGEsIGIsIGMsIGQpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JhcGhpY3M7IiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgR3JhcGhpY3MgPSByZXF1aXJlKCcuL2dyYXBoaWNzJyksXG5cdERpc3BsYXlPYmplY3QgPSByZXF1aXJlKCcuL2Rpc3BsYXlPYmplY3QnKSxcblx0c3ByaXRlcyA9IFtdLFxuXHRhdmFpbGFibGVTcHJpdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuZnVuY3Rpb24gU3ByaXRlKCkge1xuXHREaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXHRzcHJpdGVzLnB1c2godGhpcyk7XG5cdHRoaXMuX2dyYXBoaWNzID0gbmV3IEdyYXBoaWNzKCk7XG59XG5cblNwcml0ZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlLCB7XG5cdCd4Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3g7XG5cdFx0XHRyZXR1cm4gdGhpcy54ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl94ID0gYTtcblx0XHRcdHRoaXMuX2dyYXBoaWNzLnNldFhQb3NpdGlvbihhKTtcblx0XHR9XG5cdH0sXG5cdCd5Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feSlcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3k7XG5cdFx0XHRyZXR1cm4gdGhpcy55ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl95ID0gYTtcblx0XHRcdHRoaXMuX2dyYXBoaWNzLnNldFlQb3NpdGlvbihhKTtcblx0XHR9XG5cdH0sXG5cdCd6Jzoge1xuXHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKCEhdGhpcy5feilcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3o7XG5cdFx0XHRyZXR1cm4gdGhpcy56ID0gMDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24oYSl7XG5cdFx0XHR0aGlzLl96ID0gYTtcblx0XHRcdHRoaXMuX2dyYXBoaWNzLnNldFpQb3NpdGlvbihhKTtcblx0XHR9XG5cdH0sXG5cdCdub2RlJzoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZ3JhcGhpY3Mubm9kZTtcblx0XHR9XG5cdH0sXG5cdCdncmFwaGljcyc6IHtcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2dyYXBoaWNzO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ByaXRlOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IERpc3BsYXlPYmplY3QgPSByZXF1aXJlKCcuL2Rpc3BsYXkvc3ByaXRlJyk7XG5cbmZ1bmN0aW9uIFZpZXdwb3J0KHJvb3QsIHdpZHRoLCBoZWlnaHQsIGJhY2tncm91bmQpIHtcblx0RGlzcGxheU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcblx0XG5cdHRoaXMuX25vZGUgPSByb290O1xuXHRyb290LnN0eWxlLndpZHRoID0gd2lkdGg7XG5cdHJvb3Quc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRyb290LnN0eWxlLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xufVxuXG5WaWV3cG9ydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3cG9ydDsiLCIndXNlIHN0cmljdCc7XG5cbndpbmRvdy53b3dlZSA9IChmdW5jdGlvbigpe1xuXHRcblx0bGV0IFNwcml0ZSA9IHJlcXVpcmUoJy4vbGliL2Rpc3BsYXkvc3ByaXRlJyksXG5cdFx0Vmlld3BvcnQgPSByZXF1aXJlKCcuL2xpYi92aWV3cG9ydCcpLFxuXHRcdHZpZXdwb3J0ID0gbnVsbDtcblx0XG5cdHJldHVybiBmdW5jdGlvbihjb25maWcpIHtcblx0XHR2YXIgcm9vdF9lbGVtZW50ID0gY29uZmlnLnJvb3QgfHwgZG9jdW1lbnQuYm9keSxcblx0XHRcdHN0YWdlX3dpZHRoID0gY29uZmlnLndpZHRoIHx8ICcxMDAlJyxcblx0XHRcdHN0YWdlX2hlaWdodCA9IGNvbmZpZy5oZWlnaHQgfHwgJzEwMCUnO1xuXHRcdFxuXHRcdHZpZXdwb3J0ID0gbmV3IFZpZXdwb3J0KHJvb3RfZWxlbWVudCwgc3RhZ2Vfd2lkdGgsIHN0YWdlX2hlaWdodCwgY29uZmlnLmJhY2tncm91bmQgfHwgJ3doaXRlJyk7XG5cdFx0XG5cdFx0cmV0dXJuIHtcblx0XHRcdFxuXHRcdFx0Y3JlYXRlU3ByaXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBTcHJpdGUoKTtcblx0XHRcdH0sXG5cdFx0XHRcblx0XHRcdGFkZFRvVmlld3BvcnQ6IGZ1bmN0aW9uKGEpIHtcblx0XHRcdFx0dmlld3BvcnQuYWRkQ2hpbGQoYSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdH1cblx0XG59KCkpOyJdfQ==

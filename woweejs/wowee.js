'use strict';

window.wowee = (function(){
	
	let Sprite = require('./lib/display/sprite'),
		Viewport = require('./lib/viewport'),
		viewport = null,
		cycle = require('./lib/cycle'),
		tween = require('./lib/tween'),
		Camera = require('./lib/3d/scene/camera'),
		Triangle = require('./lib/3d/primitive/triangle');
	
	return function(config) {
		var root_element = config.root || document.body,
			stage_width = config.width || '100%',
			stage_height = config.height || '100%';
		
		viewport = new Viewport(root_element, stage_width, stage_height, config.background || 'white');
		cycle.setFrameRate(30);
		cycle.start();

		let camera = new Camera();
		
		console.log(camera.view);
		
		return {
			
			createSprite: function() {
				return new Sprite();
			},
			
			addToViewport: function(displayObject) {
				viewport.addChild(displayObject);
			},

			tween: function(obj, props, time, ease) {
				tween(obj, props, time, ease);
			},
			
			triangle: function(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
				return new Triangle(x1, y1, z1, x2, y2, z2, x3, y3, z3);
			}
			
		}
	}
	
}());
'use strict';

window.wowee = (function(){
	
	let Sprite = require('./lib/display/sprite'),
		Viewport = require('./lib/viewport'),
		viewport = null,
		cycle = require('./lib/cycle'),
		tween = require('./lib/tween'),
		Point3D = require('./lib/geom/point3D'),
		Camera = require('./lib/camera/camera');
	
	return function(config) {
		var root_element = config.root || document.body,
			stage_width = config.width || '100%',
			stage_height = config.height || '100%';
		
		viewport = new Viewport(root_element, stage_width, stage_height, config.background || 'white');
		cycle.setFrameRate(30);
		cycle.start();

		let p1 = new Point3D(100,100,100);
		let camera = new Camera();
		camera.focalLength = 10;
		camera.x = camera.y = camera.z = 0;
		camera.rotationX = 0;
		camera.rotationY = 0;
		camera.convertPoint3D(p1);
		
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
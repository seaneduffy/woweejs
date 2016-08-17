'use strict';

window.wowee = (function(){

	
	
	return function(config) {
		
		var root_element = config.root || document.body,
			stage_width = config.width,
			stage_height = config.height;
			
		root_element.style.width = stage_width + 'px';
		root_element.style.height = stage_height + 'px';
		root_element.style.background = config.background || 'white';
			
		window.DisplayObject3D = require('./lib/3d/display/displayObject3D');
		window.Triangle = require('./lib/3d/primitive/triangle');
		window.Camera = require('./lib/3d/scene/cameraNode');
		window.Sprite = require('./lib/display/sprite');
		window.Tween = require('./lib/animation/tween/tween');
		window.Graphics = require('./lib/display/graphics');
		Graphics.setRoot(root_element);
		Graphics.setDefaultWidth(stage_width);
		Graphics.setDefaultHeight(stage_height);
		
		let Viewport = require('./lib/3d/scene/viewport');
		
		window.viewport = new Viewport();
		
		let cycle = require('./lib/cycle');
		
		cycle.setFrameRate(30);
		cycle.start();
		cycle.add(viewport.render.bind(viewport));
		
		
	}
}());
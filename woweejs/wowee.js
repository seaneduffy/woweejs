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
		window.Triangle = require('./lib/3d/display/model/triangle');
		window.Rectangle = require('./lib/3d/display/model/rectangle');
		window.Camera = require('./lib/3d/scene/camera');
		window.Sprite = require('./lib/display/sprite');
		window.Tween = require('./lib/animation/tween/tween');
		window.Graphics = require('./lib/display/graphics');
		window.vec3 = require('gl-matrix-vec3');
		window.mat4 = require('gl-matrix-mat4');
		window.Model = require('./lib/3d/display/model/model');
		Graphics.setRoot(root_element);
		Graphics.setDefaultWidth(stage_width);
		Graphics.setDefaultHeight(stage_height);
		
		let Viewport = require('./lib/3d/scene/viewport');
		
		window.viewport = new Viewport();
		
		let cycle = require('./lib/animation/cycle');
		
		cycle.setFrameRate(30);
		cycle.start();
		cycle.add(viewport.render.bind(viewport));
		
		
	}
}());
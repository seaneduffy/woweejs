'use strict';

window.wowee = (function(){

	
	
	return function(config) {
		
		var root_element = config.root || document.body,
			stage_width = config.width,
			stage_height = config.height;
			
		root_element.style.width = stage_width + 'px';
		root_element.style.height = stage_height + 'px';
		root_element.style.background = config.background || 'white';
		var load = require('./lib/async/load');
		window.SceneNode = require('./lib/3d/scene/sceneNode');
		window.DisplayObject3D = require('./lib/3d/display/displayObject3D');
		window.Camera = require('./lib/3d/scene/camera');
		window.Tween = require('./lib/animation/tween/tween');
		window.Mesh = require('./lib/3d/display/mesh/mesh');
		window.viewport = require('./lib/3d/scene/viewport')(root_element, stage_width, stage_height);
		window.Cycle = require('./lib/animation/cycle');
		Cycle.add(window.viewport.render.bind(window.viewport));
		Cycle.setFrameRate(config.frame_rate || 20);
		Cycle.start();
	}
}());
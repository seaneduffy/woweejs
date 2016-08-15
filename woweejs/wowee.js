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
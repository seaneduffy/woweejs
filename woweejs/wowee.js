'use strict';

window.wowee = (function(){


	let load = require('./lib/async/load'),
		SceneNode = require('./lib/3d/scene/sceneNode'),
		DisplayObject3D = require('./lib/3d/display/displayObject3D'),
		Graphics = require('./lib/3d/display/graphics'),
		Camera = require('./lib/3d/scene/camera'),
		Tween = require('./lib/animation/tween/tween'),
		Mesh = require('./lib/3d/display/mesh'),
		Viewport = require('./lib/3d/scene/viewport'),
		Cycle = require('./lib/animation/cycle'),
		Log = require('./lib/log'),
		Texture = require('./lib/3d/display/texture'),
		TextureShader = require('./lib/3d/display/shaders/texture'),
		ColorShader = require('./lib/3d/display/shaders/color'),
		Material = require('./lib/3d/display/material'),
		Shader = require('./lib/3d/display/shader');

	function init(config) {
		
		let root_element = config.root || document.body,
			stage_width = config.width,
			stage_height = config.height;
			
		root_element.style.width = stage_width + 'px';
		root_element.style.height = stage_height + 'px';
		root_element.style.background = config.background || 'white';

		let viewport = Viewport.getViewport(root_element, stage_width, stage_height);

		Cycle.add(viewport.render.bind(viewport));
		Cycle.setFrameRate(config.frame_rate || 20);
	}

	return {
		SceneNode : SceneNode,
		DisplayObject3D : DisplayObject3D,
		Graphics : Graphics,
		Camera : Camera,
		Tween : Tween,
		Mesh : Mesh,
		Viewport : Viewport,
		Cycle : Cycle,
		Log : Log,
		TextureShader : TextureShader,
		Texture : Texture,
		ColorShader : ColorShader,
		Shader: Shader,
		Material: Material,
		init: init
	}
	
}());
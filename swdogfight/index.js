'use strict';

(function(){

	let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4,

	Texture = wowee.Texture,
	DisplayObject3D = wowee.DisplayObject3D,
	Mesh = wowee.Mesh,
	Graphics = wowee.Graphics,
	Camera = wowee.Camera,
	Cycle = wowee.Cycle,
	viewport = wowee.Viewport.getViewport(),
	SceneNode = wowee.SceneNode,
	Shader = wowee.Shader,
	Material = wowee.Material,
	gl = viewport.gl,
	camera = new Camera(),

	Controller = require('./lib/controller'),
	Ship = require('./lib/ship'),
	Starfield = require('./lib/starfield'),
	Drag = require('./lib/drag'),

	game = wowee.init({
		root: document.getElementById("game"), 
		width: 900, 
		height: 600,
		frame_rate: 400,
		background: "black"
	}),
	
	tie = new Ship(),
	planet = new DisplayObject3D(),
	scratchMat = mat4.create(),
	drag = new Drag(.1),
	simpleTexture = new Shader(),
	tintShader = new Shader();

	//planetMaterial.diffuseColor = [1, 0, 0, 1];
	tie.displayObject.material = new Material();
	tie.displayObject.material.diffuseColor = [1, 1, 1, 1];
	tie.displayObject.material.shader = simpleTexture;
	tie.displayObject.mesh = new Mesh();

	planet.material = new Material();
	planet.mesh = new Mesh();
	planet.material.shader = simpleTexture;

	tintShader.init('/shaders/tint.vert', '/shaders/tint.frag')
	.then(function(){
		return simpleTexture.init('/shaders/simple_tex.vert', '/shaders/simple_tex.frag');
	})
	.then(function(){
		return planet.mesh.load('planet1.json');
	})
	.then(function(){
		return planet.loadTextureImage('/planet1.png');
	})
	.then(function(){
		return tie.displayObject.mesh.load('/tie.json');
	})
	.then(function(){
		return tie.displayObject.loadTextureImage('/tie_fighter.png');
	})
	.then(function() {
		tie.displayObject.initTexture();
		tie.displayObject.initFramebuffer();
		drag.add(tie.displayObject);
		viewport.addChild(tie.displayObject);

		planet.initTexture();
		planet.initFramebuffer();
		planet.scale = 300;
		vec3.set(planet.translationVec, -500, 0, 500);
		viewport.addChild(planet);
		
		initController();
		
		viewport.camera = camera;
		camera.followDistance = 5;
		camera.followSpeed = .3;
		camera.follow(tie.displayObject);
		
		let starfield = new Starfield();
		starfield.create(tintShader);
			
		//viewport.render();

		Cycle.start();
	});

	function initController(){
		Controller.on(Controller.PITCH, function(amount){
			tie.pitch(amount);
		});
		Controller.on(Controller.PITCH_OFF, function(){
			tie.pitch(0);
		});
		Controller.on(Controller.YAW, function(amount){
			tie.yaw(amount);
		});
		Controller.on(Controller.YAW_OFF, function(){
			tie.yaw(0);
		});
		Controller.on(Controller.THRUST, function(){
			camera.followDistance = 10;
			tie.thrust(1);
		});
		Controller.on(Controller.THRUST_OFF, function(){
			camera.followDistance = 5;
			tie.thrust(0);
		});
		Controller.on(Controller.BRAKE, function(){
			tie.thrust(-1);
		});
		Controller.on(Controller.BRAKE_OFF, function(){
			tie.thrust(0);
		});
		Controller.on(Controller.BARREL, function(direction){
			tie.barrel(direction);
		});
		Controller.on(Controller.ROLL, function(direction){
			tie.roll(direction);
		});
		Controller.on(Controller.ROLL_OFF, function(){
			tie.roll(0);
		});
		Controller.on(Controller.FIRE, function(){
			tie.fire();
		});
	}

	function initMarkers(){

		let markerCountX = 5,
			markerCountZ = 5,
			markerDimensions = 200;

		for(let i = 0; i<markerCountX; i++) {
			for(let j=0; j<markerCountZ; j++) {
				let marker = createAxesGraphic(.5);
				marker.x = -markerDimensions / 2 + markerDimensions / markerCountX * i;
				marker.z = -markerDimensions / 2 + markerDimensions / markerCountZ * j;
				viewport.addChild(marker);
			}
		}
	}

	function createAxesGraphic(scale){
		let g = new Graphics();
		g.drawLine([[0,0,0],[scale,0,0]],redShader);
		g.drawLine([[0,0,0],[0,scale,0]],greenShader);
		g.drawLine([[0,0,0],[0,0,scale]],blueShader);
		return g;
	}
	
}());
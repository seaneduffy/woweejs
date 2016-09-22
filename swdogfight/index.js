'use strict';

(function(){

	let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	mat4 = glm.mat4,

	Texture = wowee.Texture,
	TextureShader = wowee.TextureShader,
	ColorShader = wowee.ColorShader,
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
	textureShader = new TextureShader(),
	tieTexture = null,
	tieMesh = null,
	planetMesh = null,
	planetTexture = null,
	/*whiteShader = new ColorShader(1, 1, 1, 1, gl.LINES),
	redShader = new ColorShader(1, 0, 0, 1, gl.LINES),
	greenShader = new ColorShader(0, 1, 0, 1, gl.LINES),
	blueShader = new ColorShader(0, 0, 1, 1, gl.LINES),
	aRedShader = new ColorShader(1, 158/255, 0, 1, gl.LINES),
	aGreenShader = new ColorShader(0, 186/255, 171/255, 1, gl.LINES),
	aBlueShader = new ColorShader(69/255, 196/255, 220/255, 1, gl.LINES),*/
	scratchMat = mat4.create(),
	drag = new Drag(.1);

	let shader = new Shader(),
		material = new Material();

	material.diffuseColor = [1, 1, 1, 1];

	shader.init('tint.vert', 'tint.frag')
	.then(function(){
		material.shader = shader;
		return Mesh.load('planet1.json');	
	})
	.then(function(mesh){
		planetMesh = mesh;
		return Texture.load('/planet1.png');
	})
	.then(function(tex){
		planetTexture = tex;
		return Mesh.load('/tie.json');	
	})
	.then(function(mesh){
		tieMesh = mesh;
		return Texture.load('/tie_fighter.png');
	})
	.then(function(tex) {
		tie.displayObject.material = material;
		//tieTexture = tex;
		let camera = new Camera(1080, 720);

		//let axes = createAxesGraphic(1);

		tie.displayObject.mesh = tieMesh;
		//tie.displayObject.texture = tieTexture;
		//tie.displayObject.addShader(textureShader);
		
		//tie.displayObject.addChild(axes);
		drag.add(tie.displayObject);

		let planet = new DisplayObject3D();
		planet.mesh = planetMesh;
		planet.material = material;
		/*planet.texture = planetTexture;
		planet.addShader(textureShader);*/
		planet.id = 'planet';
		planet.scale = 300;
		vec3.set(planet.translationVec, -500, 0, 500);
		viewport.addChild(planet);
		
		viewport.addChild(tie.displayObject);
		initController();
		viewport.camera = camera;
		camera.followDistance = 5;
		camera.followSpeed = 1;
		camera.follow(tie.displayObject);
		/*let starfield = new Starfield();
		starfield.create();*/
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
			tie.thrust(1);
		});
		Controller.on(Controller.THRUST_OFF, function(){
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
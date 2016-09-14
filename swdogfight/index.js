'use strict';

(function(){

	let Controller = require('./lib/controller'),
		Ship = require('./lib/ship');
	
	let game = wowee.init({
		root: document.getElementById("game"), 
		width: 900, 
		height: 600,
		frame_rate: 400,
		background: "black",
		material_path: "/"
	});

	let Texture = wowee.Texture,
		TextureShader = wowee.TextureShader,
		ColorShader = wowee.ColorShader,
		DisplayObject3D = wowee.DisplayObject3D,
		Mesh = wowee.Mesh,
		Graphics = wowee.Graphics,
		Camera = wowee.Camera,
		Cycle = wowee.Cycle,
		viewport = wowee.Viewport.getViewport(),
		SceneNode = wowee.SceneNode,
		gl = viewport.gl;

	let markerCountX = 5,
		markerCountZ = 5,
		markerDimensions = 200;
	
	let tie = new Ship(),
		textureShader = new TextureShader(),
		tieTexture = null,
		tieMesh = null,
		whiteShader = new ColorShader(1, 1, 1, 1, gl.LINES),
		redShader = new ColorShader(1, 0, 0, 1, gl.LINES),
		greenShader = new ColorShader(0, 1, 0, 1, gl.LINES),
		blueShader = new ColorShader(0, 0, 1, 1, gl.LINES),
		aRedShader = new ColorShader(1, 158/255, 0, 1, gl.LINES),
		aGreenShader = new ColorShader(0, 186/255, 171/255, 1, gl.LINES),
		aBlueShader = new ColorShader(69/255, 196/255, 220/255, 1, gl.LINES);

	Mesh.load('/tie.json')
	.then(function(mesh){
		tieMesh = mesh;
		return Texture.load('/tie_fighter.png');
	})
	.then(function(tex) {
		tieTexture = tex;
		let camera = new Camera(1080, 720);
		let a = new Graphics();
		a.drawLine([[0,0,0],[1,0,0]],redShader);
		a.drawLine([[0,0,0],[0,1,0]],greenShader);
		a.drawLine([[0,0,0],[0,0,1]],blueShader);
		//tie.displayObject.addChild(a);
		tie.displayObject.mesh = tieMesh;
		tie.displayObject.texture = tieTexture;
		tie.displayObject.addShader(textureShader);
		viewport.addChild(tie.displayObject);
		initMarkers();
		initController();
		viewport.camera = camera;
		camera.followDistance = 5;
		camera.followSpeed = 1;
		camera.follow(tie.displayObject);
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
	}

	function initMarkers(){
		for(let i = 0; i<markerCountX; i++) {
			for(let j=0; j<markerCountZ; j++) {
				let marker = createAxesGraphic();
				marker.x = -markerDimensions / 2 + markerDimensions / markerCountX * i;
				marker.z = -markerDimensions / 2 + markerDimensions / markerCountZ * j;
				viewport.addChild(marker);
			}
		}
	}

	function createAxesGraphic(){
		let g = new Graphics();
		g.drawLine([[0,0,0],[.5,0,0]],redShader);
		g.drawLine([[0,0,0],[0,.5,0]],greenShader);
		g.drawLine([[0,0,0],[0,0,.5]],blueShader);
		return g;
	}
	
}());
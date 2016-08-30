'use strict';
(function(){
	let Controller = require('./lib/controller'),
		Ship = require('./lib/ship');
	
	let game = wowee({
		root: document.getElementById("game"), 
		width: 900, 
		height: 600,
		frame_rate: 400,
		background: "black",
		material_path: "/"
	});
	
	let tie = new Ship();
	
	tie.displayObject = new DisplayObject3D({
		isPlane: false,
		mesh: '/tie.json',
		material: '/tie_fighter.png',
		shaders: [
			{
				type: 'texture',
				shapes: 'TRIANGLES'
			}
		],
		id: 'tie'
	});
	
	let tie2 = new DisplayObject3D({
			isPlane: false,
			mesh: '/tie.json',
			material: '/tie_fighter.png',
			shaders: [
				{
					type: 'texture',
					shapes: 'TRIANGLES'
				}
			],
			id: 'tie'
		}),
	tie3 = new DisplayObject3D({
		isPlane: false,
		mesh: '/tie.json',
		material: '/tie_fighter.png',
		shaders: [
			{
				type: 'texture',
				shapes: 'TRIANGLES'
			}
		],
		id: 'tie'
	});

	Promise.all([
		tie.displayObject.init(),
		tie2.init(),
		tie3.init()
	]).then(function(){
		let camera = new Camera(1080, 720);
		viewport.camera = camera;
		viewport.addChild(tie.displayObject);
		viewport.addChild(tie2);
		viewport.addChild(tie3);
		
		tie.displayObject.z = 2;
		tie2.z = 46;
		tie2.x = 4;
		
		tie3.z = 55;
		tie3.y = 2;
		
		camera.follow(tie.displayObject, 10);
		
		Controller.on(Controller.PITCH, function(amount){
			tie.pitch(amount);
		});
		Controller.on(Controller.YAW, function(amount){
			tie.yaw(amount);
		});
		Controller.on(Controller.FORWARD, function(){
			tie.thrust();
		});
		Controller.on(Controller.BRAKE, function(){
			tie.brake();
		});
		Controller.on(Controller.BARREL_RIGHT, function(){
			tie.barrel(1);
		});
		Controller.on(Controller.BARREL_LEFT, function(){
			tie.barrel(-1);
		});
		Controller.on(Controller.STOP_BARREL, function(){
			tie.barrel(0);
		});
		
	});
	
}());
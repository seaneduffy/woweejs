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
	
	

	/*tie.displayObject = new Graphics();
	tie.displayObject.drawLine(
		[[0,0,0],[1,0,0]],
		{
			type: 'color',
			shapes: 'LINES',
			r: 1.0,
			g: 0.0,
			b: 0.0,
			a: 1.0
		}
	);
	tie.displayObject.drawLine(
		[[0,0,0],[0,1,0]],
		{
			type: 'color',
			shapes: 'LINES',
			r: 0.0,
			g: 1.0,
			b: 0.0,
			a: 1.0
		}
	);
	tie.displayObject.drawLine(
		[[0,0,0],[0,0,1]],
		{
			type: 'color',
			shapes: 'LINES',
			r: 0.0,
			g: 0.0,
			b: 1.0,
			a: 1.0
		}
	);*/

	let origin = new Graphics();
	origin.drawLine(
		[[0,0,0],[.5,0,0]],
		{
			type: 'color',
			shapes: 'LINES',
			r: .6,
			g: 0.0,
			b: 0.0,
			a: 1.0
		}
	);
	origin.drawLine(
		[[0,0,0],[0,.5,0]],
		{
			type: 'color',
			shapes: 'LINES',
			r: 0.0,
			g: .6,
			b: 0.0,
			a: 1.0
		}
	);
	origin.drawLine(
		[[0,0,0],[0,0,.5]],
		{
			type: 'color',
			shapes: 'LINES',
			r: 0,
			g: 0.0,
			b: .6,
			a: 1.0
		}
	);

	
		
		
	
	tie.displayObject = new DisplayObject3D();
	tie.displayObject.init({
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
	
	let camera = new Camera(1080, 720);
		viewport.camera = camera;
		viewport.addChild(tie.displayObject);
		viewport.addChild(origin);
		
		camera.follow(tie.displayObject, 5);
		
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
	
	/*let tie2 = new DisplayObject3D({
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
		
		let g = new Graphics({
			shaders: [
				{
					type: 'color',
					shapes: 'LINES',
					r: 1.0,
					g: 1.0,
					b: 1.0,
					a: 1.0
				}
			]
		});
		g.drawLine([0,0,0,0,1,0]);
		viewport.addChild(g);
		
	});
	*/
	
}());
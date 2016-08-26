'use strict';

function init() {
	let game = wowee({
		root: document.getElementById("game"), 
		width: 1080, 
		height: 720,
		frame_rate: 400,
		background: "black",
		material_path: "/"
	});
	
	let tie = new DisplayObject3D({
			id: 'tie'
		}),
		tie_body = new DisplayObject3D({
			isPlane: false,
			mesh: '/tie_body.json',
			material: '/tie_body_1.png',
			shaders: [{
							type: 'color',
							r: 1.0,
							g: 1.0,
							b: 1.0,
							a: 1.0
						}],
			id: 'body'
		}),
		left_wing = new DisplayObject3D({
			isPlane: true,
			mesh: '/tie_wing_right.json',
			material: '/tie_wing.png',
			shaders: [{
							type: 'color',
							r: 1.0,
							g: 1.0,
							b: 1.0,
							a: 1.0
						}],
			id: 'leftwing'
		}),
		right_wing = new DisplayObject3D({
			isPlane: true,
			mesh: '/tie_wing_left.json',
			material: '/tie_wing.png',
			shaders: [{
							type: 'color',
							r: 1.0,
							g: 1.0,
							b: 1.0,
							a: 1.0
						}],
			id: 'rightwing'
		});
	
	Promise.all([
		tie_body.init(),
		left_wing.init(),
		right_wing.init()
	]).then(function(){
			let camera = new Camera(1080, 720);
			viewport.camera = camera;
			viewport.addChild(tie);
			tie.addChild(tie_body);
			tie.addChild(right_wing);
			tie.addChild(left_wing);
			//left_wing.scale = right_wing.scale = 2;

			tie.z = 4.5;
			tie_body.rotationY = right_wing.rotationY = left_wing.rotationY = Math.PI / 180 * 30;
			new Tween(tie, {'rotationY': Math.PI / 180*10}, 100, 'easeOutQuad');
			Cycle.start();
		
	});
	
}
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
		/*
		tie_body = new DisplayObject3D({
			isPlane: false,
			mesh: '/tie_body.json',
			material: '/tie_body_1.png',
			shaders: [
				{
					type: 'texture',
					shapes: 'TRIANGLES'
				}
			],
			id: 'body'
		}),
		left_wing = new DisplayObject3D({
			isPlane: true,
			mesh: '/tie_wing_left.json',
			material: '/tie_wing.png',
			shaders: [
				{
					type: 'texture',
					shapes: 'TRIANGLES'
				}
			],
			id: 'leftwing'
		}),
		right_wing = new DisplayObject3D({
			isPlane: true,
			mesh: '/tie_wing_left.json',
			material: '/tie_wing.png',
			shaders: [
				{
					type: 'texture',
					shapes: 'TRIANGLES'
				}
			],
			id: 'rightwing'
		});*/
	
	Promise.all([
		tie.init()
		/*tie_body.init(),
		left_wing.init(),
		right_wing.init()*/
	]).then(function(){
			let camera = new Camera(1080, 720);
			viewport.camera = camera;
			viewport.addChild(tie);
			/*tie.addChild(tie_body);
			tie.addChild(right_wing);
			tie.addChild(left_wing);
			left_wing.x = -1;
			right_wing.x = 1;
			left_wing.scale = right_wing.scale = 2;*/

			tie.z = 2;
			//tie.rotationY = Math.PI / 180 * 180;
			new Tween(tie, {'z': 2.9, 'rotationY': Math.PI / 180 * 180}, 30, 'easeOutQuad');
			Cycle.start();
		
	});
	
}
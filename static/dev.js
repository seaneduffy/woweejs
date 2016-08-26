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
	
	let tie = new DisplayObject3D(),
		tie_body = new DisplayObject3D({
			isPlane: false
		}),
		left_wing = new DisplayObject3D({
			isPlane: true
		}),
		right_wing = new DisplayObject3D({
			isPlane: true
		});
		
		tie.id = 'tie';
		tie_body.id = 'body';
		left_wing.id = 'left wing';
		right_wing.id = 'right wing';
	
	Promise.all([
		tie_body.addMeshData('/tie_body.json'),
		left_wing.addMeshData('/tie_wing.json'),
		right_wing.addMeshData('/tie_wing.json')
	]).then(function(){
			let camera = new Camera(1080, 720);
			viewport.camera = camera;
			viewport.addChild(tie);
			tie.addChild(tie_body);
			tie.addChild(right_wing);
			tie.addChild(left_wing);

			left_wing.x = 1;
			right_wing.x = -1;
			//left_wing.scale = right_wing.scale = 4;

			tie.z = 4.5;
			tie.rotationY = Math.PI / 180 * -45;
			new Tween(tie, {'rotationY': Math.PI / 180*20}, 100, 'easeOutQuad', '+');
			Cycle.start();
		
	});
	
}
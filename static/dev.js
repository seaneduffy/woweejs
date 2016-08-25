'use strict';

function init() {
	let game = wowee({
		root: document.getElementById("game"), 
		width: 1080, 
		height: 720,
		frame_rate: 200,
		background: "black",
		material_path: "/"
	});
	
	let tie = new DisplayObject3D(),
		tie_body = new DisplayObject3D(),
		left_wing = new DisplayObject3D(),
		right_wing = new DisplayObject3D();
	
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
		//new Tween(obj, {'rotationY': Math.PI / 180*40,'rotationX':Math.PI / 180 * 60}, 40, 'easeOutQuad', '+');
		Cycle.start();
	});
	
}
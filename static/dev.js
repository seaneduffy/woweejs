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
	
	let obj = null;
	
	obj = new DisplayObject3D();
	obj.onReady(function(){
		let camera = new Camera(1080, 720);
		viewport.camera = camera;
		viewport.addChild(obj);
		obj.rotationY = Math.PI / 180 * 0;
		obj.rotationX = Math.PI / 180 * 0;
		obj.rotationZ = Math.PI / 180 * 0;
		obj.position = [0, 0, 2];
		camera.rotationY = 0;
		camera.rotationX = 0;
		camera.rotationZ = 0;
		camera.x = 0;
		camera.y = 0;
		new Tween(obj, {'rotationY': Math.PI / 180*40,'rotationX':Math.PI / 180 * 60}, 40, 'easeOutQuad', '+');
		Cycle.start();
	});
	obj.addMeshData('/tie_body.json');
}
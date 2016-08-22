'use strict';

let obj = null;

function loadData(uri, cb) {
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', uri, true);   
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			cb(JSON.parse(xobj.responseText));
		}
	}
	xobj.send(null);
}

function onDataLoaded(data) {
	console.log(data);
	/*let mesh = new Mesh();
	mesh.data = data;
	mesh.addTextureImage('tie_body_1.png');
	obj.addMesh(mesh);
	start();*/
}

function init() {
	let game = wowee({
		root: document.getElementById("game"), 
		width: 1080, 
		height: 720,
		frame_rate: 10,
		background: "black"
	});
	
	obj = new DisplayObject3D();
	
	loadData('/tie1.json', onDataLoaded);
}

function start() {
	/*
	obj.rotationY = Math.PI / 180 * 180;
	obj.rotationX = Math.PI / 180 * 90;
	obj.rotationZ = Math.PI / 180 * 0;
	obj.position = [0, 0, -35];
	viewport.addChild(obj);
	let camera = new Camera(1080, 720);
	viewport.camera = camera;
	
	camera.rotationY = 0;
	camera.rotationX = 0;
	camera.rotationZ = 0;
	viewport.render();
	//new Tween(obj, {'z': -40, 'x': -40}, 1, 'easeOutQuad', '+');
	//new Tween(camera, {'rotationY':Math.PI / 180 * 82}, 1, 'easeOutSine', '+');*/
}
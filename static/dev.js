'use strict';

let game = wowee({
	root: document.getElementById("game"), 
	width: 500, 
	height: 500,
	background: "black"
});

let tri = new DisplayObject3D(),
	camera = new Camera();


let t = new Triangle(0, 50, -50, 50, 0, -50, 100, 50, -50);
let obj = new DisplayObject3D();
obj.model = t;
viewport.camera = camera;
viewport.addChild(obj);
obj.rotationY = Math.PI / 180 * 5;
//new Tween(camera, {'rotationY': Math.PI / 180 * 15}, 4, 'easeInQuad');

//camera.rotationY = Math.PI / 180 * 30;
//s.graphics.draw(camera.toDisplay(t));
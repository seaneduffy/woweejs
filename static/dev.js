'use strict';

let game = wowee({
	root: document.getElementById("game"), 
	width: 500, 
	height: 500,
	background: "black"
});

let camera = new Camera();
camera.position = vec3.set(camera.position, 0, 0, 1);
camera.target = vec3.set(camera.target, 0, 0, 0);

let t = new Triangle(-100, 100, 0, 0, 0, 0, 100, 100, 0);
let obj = new DisplayObject3D();
obj.model = new Model();
obj.model.shapes.push(t);
obj.position = vec3.fromValues(80, 50, -300);
viewport.camera = camera;
viewport.addChild(obj);
camera.rotationY = Math.PI / 180 * 90;
//obj.rotationY = Math.PI / 180 * -50;
//new Tween(obj, {'z': -600}, 2, 'easeInQuad');
//new Tween(obj, {'rotationY': Math.PI / 180 * 45}, 2, 'easeInQuad');
//new Tween(obj, {'rotationZ': Math.PI / 180 * 45}, 2, 'easeInQuad');
//new Tween(camera, {'rotationY': Math.PI / 180 * 40}, 2, 'linear');
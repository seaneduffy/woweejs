'use strict';

let DisplayObject3D = wowee.DisplayObject3D,
	Graphics = wowee.Graphics,
	ColorShader = wowee.ColorShader,
	viewport = wowee.Viewport.getViewport(),
	gl = null,
	glm = require('gl-matrix'),
	mat4 = glm.mat4;

function Laser(position, direction){

	gl = gl || viewport.gl;

	let graphics = new Graphics();
	let shader = new ColorShader(0, 1, 0, 1, gl.LINES);
	graphics.drawLine([[0,0,0],direction],shader);
	this.displayObject = new DisplayObject3D();
	this.displayObject.x = position[0];
	this.displayObject.y = position[1];
	this.displayObject.z = position[2];
	this.displayObject.addChild(graphics);
	//mat4.copy(this.displayObject.transform, transform);
	this.displayObject.force(direction, 2);
	viewport.addChild(this.displayObject);
}

module.exports = Laser;
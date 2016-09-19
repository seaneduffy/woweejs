'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	DisplayObject3D = wowee.DisplayObject3D,
	ColorShader = wowee.ColorShader,
	Graphics = wowee.Graphics,
	viewport = wowee.Viewport.getViewport(),
	gl = viewport.gl,
	Cycle = wowee.Cycle,
	Log = wowee.Log;

function Starfield(){
	this.container = new DisplayObject3D();
	viewport.addChild(this.container);
	this.camera = viewport.camera;
	this.cycleUpdate = this.update.bind(this);
	Cycle.add(this.cycleUpdate);
}

Starfield.prototype = {}

Starfield.prototype.create = function(){
	let pos = vec3.create(),
		rot = quat.create(),
		scratch = vec3.create(),
		rad = 0,
		dist = 0;
	for(let i=0; i<100; i++) {
		let star = new DisplayObject3D(),
			whiteSolidShader = new ColorShader(1, 1, 1, 1, gl.TRIANGLES),
			starGraphic = new Graphics();
			starGraphic.drawLine([
				[-1.0, -1.0,  1.0],
				[1.0, -1.0,  1.0],
				[1.0,  1.0,  1.0],
				[-1.0,  1.0,  1.0],
				[-1.0, -1.0, -1.0],
				[-1.0,  1.0, -1.0],
				[1.0,  1.0, -1.0],
				[1.0, -1.0, -1.0],
				[-1.0,  1.0, -1.0],
				[-1.0,  1.0,  1.0],
				[1.0,  1.0,  1.0],
				[1.0,  1.0, -1.0],
				[-1.0, -1.0, -1.0],
				[1.0, -1.0, -1.0],
				[1.0, -1.0,  1.0],
				[-1.0, -1.0,  1.0],
				[1.0, -1.0, -1.0],
				[1.0,  1.0, -1.0],
				[1.0,  1.0,  1.0],
				[1.0, -1.0,  1.0],
				[-1.0, -1.0, -1.0],
				[-1.0, -1.0,  1.0],
				[-1.0,  1.0,  1.0],
				[-1.0,  1.0, -1.0]
			],whiteSolidShader);
		star.addChild(starGraphic);

		vec3.set(pos, 0, 0, 998);

		dist = 998 - Math.random() * 30;

		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 0, 0, 1), rad);
		vec3.transformQuat(pos, pos, rot);

		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 0, 1, 0), rad);
		vec3.transformQuat(pos, pos, rot);

		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 1, 0, 0), rad);
		vec3.transformQuat(pos, pos, rot);

		star.x = pos[0];
		star.y = pos[1];
		star.z = pos[2];

		this.container.addChild(star);
	}
	
}

Starfield.prototype.update = function(){
	vec3.copy(this.container.translationVec, this.camera.position);
	//Log.log('pos ', this.container.translationVec);
}

module.exports = Starfield;
'use strict';

let glm = require('gl-matrix'),
	vec3 = glm.vec3,
	quat = glm.quat,
	DisplayObject3D = wowee.DisplayObject3D,
	Shader = wowee.Shader,
	Graphics = wowee.Graphics,
	viewport = wowee.Viewport.getViewport(),
	gl = viewport.gl,
	Cycle = wowee.Cycle,
	Material = wowee.Material,
	Mesh = wowee.Mesh,
	Log = wowee.Log;

function Starfield(){
	this.container = new DisplayObject3D();
	viewport.addChild(this.container);
	this.camera = viewport.camera;
	this.cycleUpdate = this.update.bind(this);
	Cycle.add(this.cycleUpdate);
}

Starfield.prototype = {};

Starfield.prototype.create = function(shader){
	let pos = vec3.create(),
		rot = quat.create(),
		scratch = vec3.create(),
		rad = 0,
		star = new Graphics(),
		material = new Material(),
		vertexes = [];

	star.material = material;
	material.diffuseColor = [1, 1, 1, 1];
	material.strokeSize = 2.0;
	material.shader = shader;

	for(let i=0; i<200; i++) {
		vec3.set(pos, 0, 0, 998);
		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 0, 0, 1), rad);
		vec3.transformQuat(pos, pos, rot);
		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 0, 1, 0), rad);
		vec3.transformQuat(pos, pos, rot);
		rad = Math.random() * Math.PI * 2;
		quat.setAxisAngle(rot, vec3.set(scratch, 1, 0, 0), rad);
		vec3.transformQuat(pos, pos, rot);
		vertexes.push(vec3.fromValues(pos[0], pos[1], pos[2]));
	}
	star.draw(vertexes, gl.POINTS);
	this.container.addChild(star);
}

Starfield.prototype.update = function(){
	vec3.copy(this.container.translationVec, this.camera.position);
	//Log.log('pos ', this.container.translationVec);
}

module.exports = Starfield;
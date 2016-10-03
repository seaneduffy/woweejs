'use strict';

let SceneNode = require('./sceneNode'),
	geom = require('../../geom'),
	glm = require('gl-matrix'),
	Tween = require('../../animation/tween/tween'),
	vec2 = glm.vec2,
	vec3 = glm.vec3,
	mat4 = glm.mat4,
	quat = glm.quat,
	Viewport = require('../../3d/scene/viewport'),
	Cycle = require('../../animation/cycle'),
	Log = require('../../log'),
	viewport = Viewport.getViewport();

const UP = vec3.fromValues(0, 1, 0);

function Camera(){
	
	SceneNode.prototype.constructor.call(this);

	this.up = UP;
	
	this.position = new Float32Array(3);
	this.front = new Float32Array(3);
	this.projection = new Float32Array(16);
	this.view = new Float32Array(16);
	this.pvMatrix = new Float32Array(16);
	this.targetPosition = new Float32Array(3);
	this.scratchVec = new Float32Array(3);
	this.scratchVec2 = new Float32Array(3);
	this.scratchMat = new Float32Array(16);
	this.scratchQuat = new Float32Array(4);

	this.front = vec3.fromValues(0, 0, 0);
	
	mat4.perspective(this.projection, Math.PI / 180 * 45, viewport.width / viewport.height, .1, 1000);
	this.setView();
}

Camera.prototype = Object.create(SceneNode);
Camera.prototype.constructor = Camera;

Camera.prototype.follow = function(node) {
	this.followNode = node;
	this.cycleFollowMove = this.followMove.bind(this);
	Cycle.add(this.cycleFollowMove);
};

Camera.prototype.force = function() {

};

Camera.prototype.followMove = function() {

	mat4.getRotation(this.scratchQuat, this.followNode.transform);

	quat.normalize(this.scratchQuat, this.scratchQuat);

	mat4.getTranslation(this.scratchVec, this.followNode.transform);

	vec3.transformQuat(this.scratchVec2, vec3.set(this.scratchVec2, 0, 0, this.followDistance), this.scratchQuat);

	//this.scratchVec[1] = 0;

	vec3.normalize(this.scratchVec2, this.scratchVec2);

	vec3.scale(this.scratchVec2, this.scratchVec2, this.followDistance);

	vec3.sub(this.targetPosition, this.scratchVec, this.scratchVec2);

	let d = vec3.dist(this.targetPosition, this.position);

	if(d < this.followSpeed) {

		vec3.copy(this.position, this.targetPosition);

	} else {

		vec3.sub(this.scratchVec2, this.scratchVec, this.position);

		d = vec3.dist(this.scratchVec, this.position);

		if(d > this.followDistance) {
			vec3.normalize(this.scratchVec2, this.scratchVec2);
			vec3.scale(this.scratchVec2, this.scratchVec2, this.followDistance);
			vec3.sub(this.position, this.scratchVec, this.scratchVec2);
		}

		vec3.sub(this.scratchVec2, this.targetPosition, this.position);

		vec3.normalize(this.scratchVec2, this.scratchVec2);

		vec3.scale(this.scratchVec2, this.scratchVec2, this.followSpeed);

		vec3.add(this.position, this.position, this.scratchVec2);

		vec3.add(this.front, this.front, this.scratchVec2);

		
	}

	vec3.copy(this.front, this.scratchVec);

	/*d = vec3.dist(this.scratchVec, this.front);

	if(d < this.followSpeed) {
		
		vec3.copy(this.front, this.scratchVec);

	} else {

		vec3.sub(this.scratchVec2, this.scratchVec, this.front);

		vec3.normalize(this.scratchVec2, this.scratchVec2);

		vec3.scale(this.scratchVec2, this.scratchVec2, this.followSpeed);

		vec3.add(this.front, this.front, this.scratchVec2);

	}*/

	this.setView();
	
};

Camera.prototype.setView = function() {
	mat4.lookAt(this.view, this.position, this.front, this.up);
	mat4.mul(this.pvMatrix, this.projection, this.view);
};

module.exports = Camera;
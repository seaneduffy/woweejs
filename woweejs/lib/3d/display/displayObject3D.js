'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	SceneNode = require('../scene/sceneNode'),
	Mesh = require('./mesh/mesh');

function DisplayObject3D() {
	SceneNode.prototype.constructor.call(this);
	this.renderTransform = new Float32Array(16);
}

DisplayObject3D.prototype = Object.create(SceneNode.prototype, {
	'meshes': {
		get: function(){
			if(!!this._meshes) {
				return this._meshes;
			}
			return this._meshes = [];
		}
	},
	'graphics': {
		get: function(){
			return this._graphics;
		},
		set: function(graphics){
			this._graphics = graphics;
		}
	},
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			this.mesh.viewport = viewport;
			this.children.forEach(function(child){
				child.viewport = viewport;
			});
		}
	}
});

DisplayObject3D.prototype.addMesh = function(mesh) {
	this.meshes.push(mesh);
}

DisplayObject3D.prototype.addChild = function(childNode) {
	
	SceneNode.prototype.addChild.call(this, childNode);
	
	if(!!this.viewport) {
		childNode.viewport = this.viewport;
	}
}

DisplayObject3D.prototype.render = function(camera){

	this.meshes.forEach( mesh =>{
		mat4.mul(this.renderTransform, camera.pvMatrix, this.transform);
		mesh.render(camera, this.renderTransform);
	});
	
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
};

module.exports = DisplayObject3D;
'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	load = require('../../async/load'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh/mesh'),
	viewport = require('../../3d/scene/viewport')(),
	gl = viewport.gl;

function DisplayObject3D(config) {
	SceneNode.prototype.constructor.call(this);
	this.config = config;
}

DisplayObject3D.prototype = Object.create(SceneNode.prototype);

DisplayObject3D.prototype.addMeshData = function(dataUri) {
	
	return new Promise( (resolve, reject) => {
		load(dataUri).then(data=>{
			this.mesh = new Mesh(data, ()=>{
				resolve();
			});
		});
	});
	
}

DisplayObject3D.prototype.render = function(camera){
	
	if(!!this.config && this.config.isPlane) {
		gl.disable(gl.CULL_FACE);
	} else if(!!this.config && !this.config.isPlane) {
		gl.enable(gl.CULL_FACE);
	}
		
	if(!!this.mesh) {
		this.mesh.render(camera, this.transform);
	}
	
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
};

module.exports = DisplayObject3D;
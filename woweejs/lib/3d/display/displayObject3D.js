'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	load = require('../../async/load'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh/mesh');

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
	}
});

DisplayObject3D.prototype.addMeshData = function(dataUri) {
	
	this.readyPromise = new Promise( (resolve, reject) => {
		load(dataUri).then(data=>{
			this.mesh = new Mesh(data, ()=>{
				resolve();
			});
		});
	});
	
	
}

DisplayObject3D.prototype.meshLoaded = function() {
	this.mlc = this.mlc || 0;
	this.mlc++;
	
	if(this.mlc >= this.meshes.length) {
		this.ready = true;
		if(!!this.readyCallback) {
			this.readyCallback();
		}
	}
}

DisplayObject3D.prototype.render = function(camera){
	if(!!this.mesh) {
		this.mesh.render(camera, this.transform);
	}
	
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
};

module.exports = DisplayObject3D;
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
	},
	'viewport': {
		set: function(viewport) {
			this._viewport = viewport;
			//this.mesh.viewport = viewport;
			this.children.forEach(function(child){
				child.viewport = viewport;
			});
		}
	}
});

DisplayObject3D.prototype.onReady = function(cb) {
	this.readyCallback = cb;
	if(this.ready) {
		cb();
	}
}

DisplayObject3D.prototype.addMeshData = function(dataUri) {
	load(dataUri).then(data=>{
		data.forEach((meshData, index)=>{
			if(index === 2) {
				this.meshes.push(new Mesh(meshData, ()=>{
					this.meshLoaded();
				}));
			}
			
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

DisplayObject3D.prototype.addChild = function(childNode) {
	
	SceneNode.prototype.addChild.call(this, childNode);
	
	if(!!this.viewport) {
		childNode.viewport = this.viewport;
	}
}

DisplayObject3D.prototype.render = function(camera){
	this.meshes.forEach( mesh =>{
		//mat4.mul(this.renderTransform, camera.pvMatrix, this.transform);
		//mesh.render(camera, this.renderTransform);
		mesh.render(camera, this.transform);
	});
	
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
};

module.exports = DisplayObject3D;
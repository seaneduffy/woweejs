'use strict';

let SceneNode = require('./sceneNode'),
	Cycle = require('../../animation/cycle');
	
let vp = null;

function Viewport() {	
	SceneNode.prototype.constructor.call(this);
	
	this._canvas = document.createElement('canvas');
	this._canvas.style.zIndex = 0;
	this._canvas.style.position = 'absolute';
	this._canvas.style.transform = 'translate(0, 0)';
	this.gl = this._canvas.getContext('experimental-webgl');
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.cullFace(this.gl.FRONT);
}

Viewport.prototype = Object.create(SceneNode.prototype, {
	'gl': {
		get: function() {
			return this._gl;
		},
		set: function(gl) {
			this._gl = gl;
		}
	},
	'width': {
		get: function(){
			return this._width || 512;
		},
		set: function(width){
			this._width = width;
			
		this._canvas.width = this.width;
		this.gl.viewport(0, 0, this.width, this.height);
		}
	},
	'height': {
		get: function(){
			return this._height || 512;
		},
		set: function(height){
			this._height = height;
			this._canvas.height = this.height;
			this.gl.viewport(0, 0, this.width, this.height);
		}
	},
	'root': {
		get: function(){
			return this._root;
		},
		set: function(root){
			this._root = root;
			this.root.appendChild(this._canvas);
		}
	},
	'camera': {
		get: function(){
			return this._camera;
		},
		set: function(camera){
			this._camera = camera;
			camera.viewport = this;
		}
	},
	'faces': {
		get: function(){
			if(!!this._faces) {
				return this._faces;
			}
			return this._faces = [];
		},
		set: function(faces){
			this._faces = faces;
		}
	}
});

Viewport.prototype.addFaces = function(faces) {
	/*faces.forEach(face=>{
		this.root.appendChild(face.canvas);
		face.viewport = this;
		face.drawTexture(this.width, this.height);
	});
	this.faces = this.faces.concat(faces);*/
}

Viewport.prototype.addChild = function(childNode) {
	SceneNode.prototype.addChild.call(this, childNode);
	childNode.viewport = this;
}

Viewport.prototype.render = function(){
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.children.forEach( childNode => {
		childNode.render(this.camera);
	});
}

Viewport.prototype.renderFace = function(canvas, t){
	if(!!t) {
		this._context.save();
		this._context.setTransform(t[0],t[1],t[2],t[3],t[4],t[5]);
		this._context.drawImage(canvas, 0,0);
		this._context.restore();
	} else {
		this._context.drawImage(canvas, 0, 0);
	}
}

module.exports = function(root, width, height){
	
	vp = vp || new Viewport();
	
	if(!!root) {
		vp.root = root;
	}
	if(!!width) {
		vp.width = width;
	}
	if(!!height) {
		vp.height = height;
	}

	return vp;
};
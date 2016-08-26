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

var c = 0;

Viewport.prototype.render = function(){
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	let tmp = [];
	flattenChildTree(tmp, this.children);

	tmp.sort(function(a, b) {
		return b.transform[14] - a.transform[14];
	});

	tmp.forEach( childNode => {
		childNode.render(this.camera);
	});
};

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

function flattenChildTree(out, arr) {
	arr.forEach( child => {
		out.push(child);
		flattenChildTree(out, child.children);
	});
}
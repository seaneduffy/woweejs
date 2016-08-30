'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	vec3 = glm.vec3,
	quat = glm.quat,
	load = require('../../async/load'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh/mesh'),
	TextureShader = require('../../3d/display/shaders/texture'),
	ColorShader = require('../../3d/display/shaders/color'),
	viewport = require('../../3d/scene/viewport')(),
	gl = viewport.gl;

function DisplayObject3D(config) {
	
	SceneNode.prototype.constructor.call(this);
	
	this.config = config;
	
	this.cycleMove = this.move.bind(this);
	
	Cycle.add(this.cycleMove);

}

DisplayObject3D.prototype = Object.create(SceneNode.prototype, {
	'velocity': {
		get: function() {
			if(!!this._velocity) {
				return this._velocity;
			}
			return this._velocity = vec3.create();
		},
		set: function(v) {
			vec3.copy(this._velocity, v);
		}
	},
	'drx': {
		get: function() {
			if(!!this._drx) {
				return this._drx;
			}
			return this._drx = 0;
		},
		set: function(drx) {
			this._drx = drx;
		}
	},
	'dry': {
		get: function() {
			if(!!this._dry) {
				return this._dry;
			}
			return this._dry = 0;
		},
		set: function(dry) {
			this._dry = dry;
		}
	},
	'drz': {
		get: function() {
			if(!!this._drz) {
				return this._drz;
			}
			return this._drz = 0;
		},
		set: function(drz) {
			this._drz = drz;
		}
	}
});

DisplayObject3D.prototype.loadMaterial = function() {
	
	return new Promise((resolve, reject)=>{
		if(!!this.config.material){
			load(this.config.material, 'image').then(image=>{
				this.material = image;
				resolve();
			});
		} else {
			resolve();
		}
	});
};

DisplayObject3D.prototype.loadMesh = function() {
	
	return new Promise((resolve, reject)=>{
		if(!!this.config.mesh){
			load(this.config.mesh).then(data=>{
				this.mesh = data;
				resolve();
			});
		} else {
			resolve();
		}
	});
};

DisplayObject3D.prototype.init = function() {

	return new Promise( (resolve, reject) => {

		return this.loadMaterial().then(()=>{
			return this.loadMesh();
		}).then(()=>{
			this.initShaders();
			this.initBuffers();
			resolve();
		});

	});
};

DisplayObject3D.prototype.initShaders = function() {

	this.shaders = [];

	if(!!this.config.shaders) {
		this.shaders = this.config.shaders.map( shader => {
			let s = null;
			if(shader.type === 'color') {
				s = new ColorShader(shader.r, shader.g, shader.b, shader.a);
			} else if(shader.type === 'texture') {
				s = new TextureShader(this.material);
			}
			s.shapes = shader.shapes;
			return s;
		});
	}
}

DisplayObject3D.prototype.initBuffers = function(){
	
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);
	
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.vertexIndices), gl.STATIC_DRAW);
	
	if(!!this.material) {
		this.textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.texels), gl.STATIC_DRAW);
	}
}

DisplayObject3D.prototype.render = function(camera){
	
	if(typeof this.shaders === 'undefined') {
		return;
	}

	this.shaders.forEach( shader => {
		
		if(!!this.config && this.config.isPlane) {
			//gl.disable(gl.CULL_FACE);
		} else if(!!this.config && !this.config.isPlane) {
			//gl.enable(gl.CULL_FACE);
		}
		gl.useProgram(shader.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		if(!!shader.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
			gl.vertexAttribPointer(shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, shader.texture);
		}
		gl.uniform1i(gl.getUniformLocation(shader.program, "uSampler"), 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		var pUniform = gl.getUniformLocation(shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		
		gl.drawArrays(gl[shader.shapes], 0, this.mesh.vertexIndices.length);
		//gl.drawElements(gl[shader.shapes], this.mesh.vertexIndices.length, gl.UNSIGNED_SHORT, 0);
	});

};

let consoleTiePositionX = document.querySelector('#tie-position .x'),
		consoleTiePositionY = document.querySelector('#tie-position .y'),
		consoleTiePositionZ = document.querySelector('#tie-position .z'),
		consoleTieRotationX = document.querySelector('#tie-rotation .x'),
		consoleTieRotationY = document.querySelector('#tie-rotation .y'),
		consoleTieRotationZ = document.querySelector('#tie-rotation .z');

DisplayObject3D.prototype.move = function() {
	if(this.velocity[0] === 0 && this.velocity[1] === 0 && this.velocity[2] === 0 && this.drx === 0 && this.dry === 0)
		return;
	vec3.add(this.translationVec, this.translationVec, this.velocity);
	quat.rotateX(this.rotationQuat, this.rotationQuat, this.drx);
	quat.rotateY(this.rotationQuat, this.rotationQuat, this.dry);
	quat.rotateZ(this.rotationQuat, this.rotationQuat, this.drz);
	this.updateTransform();

	let translationVec = vec3.create();
	mat4.getTranslation(translationVec, this.transform);

	consoleTiePositionX.innerHTML = translationVec[0];
	consoleTiePositionY.innerHTML = translationVec[1];
	consoleTiePositionZ.innerHTML = translationVec[2];/*
	consoleTieRotationX.innerHTML = tie.displayObject.rotationX;
	consoleTieRotationY.innerHTML = tie.displayObject.rotationY;
	consoleTieRotationZ.innerHTML = tie.displayObject.rotationZ;*/
};

module.exports = DisplayObject3D;
'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	vec3 = glm.vec3,
	quat = glm.quat,
	load = require('../../async/load'),
	Cycle = require('../../animation/cycle'),
	SceneNode = require('../../3d/scene/sceneNode'),
	Mesh = require('../../3d/display/mesh'),
	viewport = require('../../3d/scene/viewport').getViewport(),
	gl = viewport.gl;

	window.gl = viewport.gl;

function DisplayObject3D() {

	SceneNode.prototype.constructor.call(this);
	this.shaders = [];
	this.zVec = vec3.fromValues(0, 0, 1);
	this.yVec = vec3.fromValues(0, 1, 0);
	this.xVec = vec3.fromValues(1, 0, 0);
	this.globalZVec = vec3.fromValues(0, 0, 1);
	this.globalYVec = vec3.fromValues(0, 1, 0);
	this.globalXVec = vec3.fromValues(1, 0, 0);
	this.yawQuat = quat.create();
	this.pitchQuat = quat.create();
	this.rollQuat = quat.create();
	this.forceVec = vec3.create();
	this.velocity = vec3.create();
	this.mvpMat4 = mat4.create();
	this.invModelMat4 = mat4.create();
	this.cycleMove = this.move.bind(this);
	Cycle.add(this.cycleMove);
	
}

DisplayObject3D.prototype = Object.create(SceneNode.prototype, {
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

DisplayObject3D.prototype.constructor = DisplayObject3D;

DisplayObject3D.prototype.move = function(){
	vec3.add(this.translationVec, this.translationVec, this.velocity);
	this.updateTransform();
};

DisplayObject3D.prototype.roll = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.rollQuat, this.zVec, amount);
	vec3.transformQuat(this.xVec, this.xVec, this.rollQuat);
	vec3.transformQuat(this.yVec, this.yVec, this.rollQuat);
	vec3.normalize(this.xVec, this.xVec);
	vec3.normalize(this.yVec, this.yVec);
	// roll rotation
	quat.setAxisAngle(this.rollQuat, this.globalZVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.rollQuat);

};

DisplayObject3D.prototype.pitch = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.pitchQuat, this.xVec, amount);
	vec3.transformQuat(this.zVec, this.zVec, this.pitchQuat);
	vec3.transformQuat(this.yVec, this.yVec, this.pitchQuat);
	vec3.normalize(this.zVec, this.zVec);
	vec3.normalize(this.yVec, this.yVec);

	// roll rotation
	quat.setAxisAngle(this.pitchQuat, this.globalXVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.pitchQuat);
};

DisplayObject3D.prototype.yaw = function(amount) {

	// roll orientation
	quat.setAxisAngle(this.yawQuat, this.yVec, amount);
	vec3.transformQuat(this.zVec, this.zVec, this.yawQuat);
	vec3.transformQuat(this.xVec, this.xVec, this.yawQuat);
	vec3.normalize(this.zVec, this.zVec);
	vec3.normalize(this.xVec, this.xVec);

	// roll rotation
	quat.setAxisAngle(this.yawQuat, this.globalYVec, amount);
	quat.mul(this.rotationQuat, this.rotationQuat, this.yawQuat);
};

DisplayObject3D.prototype.force = function(direction, amount) {
	vec3.scale(this.forceVec, direction, amount);
	vec3.add(this.velocity, this.velocity, this.forceVec);
};

DisplayObject3D.prototype.loadTextureImage = function(src) {
	return new Promise((resolve, reject)=>{
		load(src, 'image').then(image=>{
			this.textureImage = image;
			resolve();
		});
	});
	
};

DisplayObject3D.prototype.initTexture = function(src) {

	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	
	if(!!this.textureImage) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImage);	
	} else {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/*
gl.viewport(0, 0, rttFramebuffer.width, rttFramebuffer.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
mat4.perspective(45, laptopScreenAspectRatio, 0.1, 100.0, pMatrix);
gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
gl.uniform3f(shaderProgram.ambientLightingColorUniform, 0.2, 0.2, 0.2);
gl.uniform3f(shaderProgram.pointLightingLocationUniform, 0, 0, -5);
gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, false);
gl.uniform1i(shaderProgram.useTexturesUniform, true);
gl.uniform3f(shaderProgram.materialAmbientColorUniform, 1.0, 1.0, 1.0);
gl.uniform3f(shaderProgram.materialDiffuseColorUniform, 1.0, 1.0, 1.0);
gl.uniform3f(shaderProgram.materialSpecularColorUniform, 0.0, 0.0, 0.0);
gl.uniform1f(shaderProgram.materialShininessUniform, 0);
gl.uniform3f(shaderProgram.materialEmissiveColorUniform, 0.0, 0.0, 0.0);
mat4.identity(mvMatrix);
mat4.translate(mvMatrix, [0, 0, -5]);
mat4.rotate(mvMatrix, degToRad(30), [1, 0, 0]);
mvPushMatrix();
mat4.rotate(mvMatrix, degToRad(moonAngle), [0, 1, 0]);
mat4.translate(mvMatrix, [2, 0, 0]);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, moonTexture);
gl.uniform1i(shaderProgram.samplerUniform, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexPositionBuffer);
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, moonVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexTextureCoordBuffer);
gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, moonVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexNormalBuffer);
gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, moonVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonVertexIndexBuffer);
setMatrixUniforms();
gl.drawElements(gl.TRIANGLES, moonVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
mvPopMatrix();
mvPushMatrix();
mat4.rotate(mvMatrix, degToRad(cubeAngle), [0, 1, 0]);
mat4.translate(mvMatrix, [1.25, 0, 0]);
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, crateTexture);
gl.uniform1i(shaderProgram.samplerUniform, 0);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
setMatrixUniforms();
gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
mvPopMatrix();
gl.bindTexture(gl.TEXTURE_2D, rttTexture);
gl.generateMipmap(gl.TEXTURE_2D);
gl.bindTexture(gl.TEXTURE_2D, null);
*/


DisplayObject3D.prototype.initFramebuffer = function(src) {

	if(typeof this.texture === 'undefined') {
		return;
	}

	this.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    if(!!this.textureImage) {
    	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.textureImage.width, this.textureImage.height);
    } else {
    	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 512, 512);
    }
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};

DisplayObject3D.prototype.addShader = function(s) {
	this.shaders.push(s);
};

DisplayObject3D.prototype.render = function(camera){

	this.children.forEach( child=>{
		child.updateWorldTransform(this.transform);
	});

	if(typeof this.mesh === 'undefined') {
		return;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	

	if(!!this.mesh.textureBuffer && !!this.texture) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);

	mat4.mul(this.mvpMat4, camera.pvMatrix, this.transform);
	
	mat4.invert(this.invModelMat4, this.transform);

	this.material.apply(this.mvpMat4, this.transform, this.invModelMat4, camera.pvMatrix);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	gl.drawElements(gl.TRIANGLES, this.mesh.vertexLength, gl.UNSIGNED_SHORT, 0);
	//gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertexLength);

	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);

	this.material.remove();

};

module.exports = DisplayObject3D;
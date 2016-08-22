'use strict';

let glm = require('gl-matrix'),
	mat4 = glm.mat4,
	mat3 = glm.mat3,
	vec3 = glm.vec3,
	vec2 = glm.vec2;

function Face() {
	/*this._canvas = document.createElement('canvas');
	this._canvas.style.position = 'absolute';
	this._canvas.style.left = '0';
	this._canvas.style.top = '0';
	this._canvas.style.transform = 'translate(-10000px, 0)';
	this._context = this._canvas.getContext('');*/
}

Object.defineProperties(Face.prototype, {
	'vertices': {
		get: function(){
			if(!!this._vertices) {
				return this._vertices;
			}
			return this._vertices = [];
		},
		set: function(vertices){
			this._vertices = vertices;
		}
	},
	'texture': {
		get: function(){
			return this._texture;
		},
		set: function(texture) {
			this._texture = texture;
		}
	},
	'viewport': {
		get: function(){
			return this._viewport;
		},
		set: function(viewport) {
			this._viewport = viewport;
			if(!this.width) {
				this.width = viewport.width;
				this.height = viewport.height;
				this._canvas.setAttribute('width', this.width + 'px');
				this._canvas.setAttribute('height', this.height + 'px');
			}
		}
	}
});

Face.prototype.drawTexture = function() {

	if(!this.textureVertices)
		return;
	
	let tex_width = this.texture.width,
   		tex_height = this.texture.height,
		startX = null,
		startY = null,
		minX = -1,
		maxX = -1,
		minY = -1,
		maxY = -1,
		minTX = -1,
		minTY = -1,
		maxTX = -1,
		maxTY = -1;
		
	this.textureVertices.forEach((tv, index)=>{
		
		let x = tv[0] * tex_width,
			y = tv[1] * tex_height;

		if(minX === -1 || minX > x) {
			minX = x;
		}
		if(maxX === -1 || maxX < x) {
			maxX = x;
		}
		if(minY === -1 || minY > y) {
			minY = y;
		}
		if(maxY === -1 || maxY < y) {
			maxY = y;
		}
	});
	
	this.projectionTextureVertices = [];
	
	this.textureOffset = [minX, minY];
	
	this._context.save();

	this.path(this.textureVertices
		.map(vertex=>{
			let v = [vertex[0] * tex_width - minX, vertex[1] * tex_height - minY];
			//let v = [vertex[0] * tex_width, vertex[1] * tex_height];
			this.projectionTextureVertices.push(v);
			return v;
		}));
	
	this._context.clip();
	
	let w = maxX - minX,
		h = maxY - minY;
	
	this._context.drawImage(this.texture, minX, minY, w, h, 0, 0, w, h);
	
	this._context.restore();
}

Face.prototype.path = function(vertices){
	
	this._context.beginPath();
	
	let startX = null,
		startY = null;
	
	vertices.forEach((vertex, index)=>{
		if(index === 0) {
			startX = vertex[0];
			startY = vertex[1];
			this._context.moveTo(startX, startY);
		} else {
			this._context.lineTo(vertex[0], vertex[1]);
		}
		if(index === vertices.length-1){
			this._context.lineTo(startX, startY);
		}
	});
	this._context.closePath();
};
var counter = 0;
Face.prototype.render = function(camera, transform){
	
	
	this.positionVertices.forEach((vertex, index)=>{
		camera.project(this.projectionVertices[index], vertex, transform);
		this.projectionVertices[index][0] *= this.viewport.width;
		this.projectionVertices[index][1] *= this.viewport.height;
	});
	
	
	if(!!this.textureVertices) {
		
		let tvm = null,
			pvm = null,
			vm = null,
			tm = null;
			if(this.projectionTextureVertices.length === 3) {
				
				let ptv = this.projectionTextureVertices,
					pv = this.projectionVertices;
				
				tvm = mat4.fromValues(
					ptv[0][0], ptv[1][0], ptv[2][0],
					ptv[0][1], ptv[1][1], ptv[2][1],
					1, 1, 1
				);
				
				pvm = mat3.fromValues(
					pv[0][0], pv[1][0], pv[2][0],
					pv[0][1], pv[1][1], pv[2][1],
					1, 1, 1
				);
				
				let tm = mat3.invert(mat3.create(), tvm);
				
				mat3.mul(tm, tm, pvm);
				
				if(counter === 0 ) {
					/*
					console.log('texture');
					console.log(ptv[0][0] + ' ' +
						ptv[0][1]);
					console.log(ptv[1][0] + ' ' +
						ptv[1][1]);
					console.log(ptv[2][0] + ' ' +
						ptv[2][1]);
					console.log('');
					
					console.log('projection');
					console.log(pv[0][0] + ' ' +
						pv[0][1]);
					console.log(pv[1][0] + ' ' +
						pv[1][1]);
					console.log(pv[2][0] + ' ' +
						pv[2][1]);
					console.log('');
					*/
					
					
					ptv.forEach(function(v){
						vec2.transformMat3(v, v, tm);
					});
					/*
					console.log('texture');
					console.log(ptv[0][0] + ' ' +
						ptv[0][1]);
					console.log(ptv[1][0] + ' ' +
						ptv[1][1]);
					console.log(ptv[2][0] + ' ' +
						ptv[2][1]);
					console.log('');
					
					console.log(tm);
					console.log(mat3ToCSSTransform(tm));
					*/
					this.viewport.renderFace(this.canvas, mat3ToCSSTransform([
						1, 0, 0, 1, 0, 0
					]));
					
					this.viewport.renderFace(this.canvas, mat3ToCSSTransform(tm));
					
					

					this._context.fillStyle = 'red';
					this._context.strokeStyle = 'blue';
					this._context.clearRect(0, 0, this.width, this.height);
					this.path(this.projectionVertices);
					this._context.fill();
					this._context.stroke();
					//this.viewport.renderFace(this.canvas, 0, 0);
					
					//counter++;
				}
				
				
			} else if(this.projectionTextureVertices.length === 4) {
			
			}
		
	} else {
		this._context.fillStyle = 'red';
		this._context.strokeStyle = 'blue';
		this._context.clearRect(0, 0, this.width, this.height);
		this.path(this.projectionVertices);
		this._context.fill();
		this._context.stroke();
		this.viewport.renderFace(this.canvas, 0, 0);
	}
	
	
	
};

function invertMat3(m) {
	let a00 = m[0], a01 = m[1], a02 = m[2],
		a10 = m[3], a11 = m[4], a12 = m[5],
		a20 = m[6], a21 = m[7], a22 = m[8];
		
	let mm00 = a11 * a22 - a12 * a21,
		mm01 = a10 * a22 - a12 * a20,
		mm02 = a10 * a21 - a11 * a20,
		mm10 = a01 * a22 - a02 * a21,
		mm11 = a00 * a22 - a02 * a20,
		mm12 = a00 * a21 - a01 * a20,
		mm20 = a01 * a12 - a02 * a11,
		mm21 = a00 * a12 - a02 * a10,
		mm22 = a00 * a11 - a01 * a10;
		
	let mc00 = mm00,
		mc01 = -mm01,
		mc02 = mm02,
		mc10 = -mm10,
		mc11 = mm11,
		mc12 = -mm12,
		mc20 = mm20,
		mc21 = -mm21,
		mc22 = mm22;
		
	let ma00 = mc00,
		ma01 = mc10,
		ma02 = mc20,
		ma10 = mc01,
		ma11 = mc11,
		ma12 = mc21,
		ma20 = mc02,
		ma21 = mc12,
		ma22 = mc22;
		
	let d = 1 / (a00 * mm00 + a01 * mm01 + a02 * mm02);
	
	let out = new Float32Array(9);
	
	out[0] = ma00 * d;
	out[1] = ma01 * d;
	out[2] = ma02 * d;
	out[3] = ma10 * d;
	out[4] = ma11 * d;
	out[5] = ma12 * d;
	out[6] = ma20 * d;
	out[7] = ma21 * d;
	out[8] = ma22 * d;
	
	return out;
}

function mat3ToCSSTransform(m3) {
	return [m3[1], m3[0], m3[3], m3[4], m3[2], m3[5]];
}

module.exports = Face;
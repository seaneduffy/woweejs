'use strict';

let viewport = require('../../3d/scene/viewport')(),
	gl = viewport.gl,
	ColorShader = require('../../3d/display/shaders/color'),
	TextureShader = require('../../3d/display/shaders/texture'),
	DisplayObject3D = require('../../3d/display/displayObject3D');

function Graphics() {
	DisplayObject3D.prototype.constructor.call(this);
	this.graphics = [];
}

Graphics.prototype = Object.create(DisplayObject3D.prototype);

Graphics.prototype.constructor = Graphics;

Graphics.prototype.initShader = function(obj) {
	let shader = null;
	if(obj.type === 'color') {
		shader = new ColorShader(obj.r, obj.g, obj.b, obj.a);
	} else if(obj.type === 'texture') {
		//shader = new TextureShader(this.material);
	}
	shader.shapes = obj.shapes;
	return shader;
};

Graphics.prototype.drawLine = function(points, shader){
	
	let graphicsObj = {
		vertexBuffer : gl.createBuffer(),
		indexBuffer : gl.createBuffer(),
		vertices : [],
		vertexIndices : [],
		shader: this.initShader(shader)
	};

	this.graphics.push(graphicsObj);

	points.forEach( (point, index) => {
		point.forEach( v => {
			graphicsObj.vertices.push(v);
		});
		graphicsObj.vertexIndices.push(index);
	});
	gl.bindBuffer(gl.ARRAY_BUFFER, graphicsObj.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(graphicsObj.vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphicsObj.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(graphicsObj.vertexIndices), gl.STATIC_DRAW);
};

Graphics.prototype.render = function(camera){

	this.graphics.forEach( graphic => {
		
		gl.useProgram(graphic.shader.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, graphic.vertexBuffer);
		gl.vertexAttribPointer(graphic.shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		if(!!graphic.shader.texture) {
			gl.bindBuffer(gl.ARRAY_BUFFER, graphic.textureBuffer);
			gl.vertexAttribPointer(graphic.shader.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, graphic.shader.texture);
		}
		gl.uniform1i(gl.getUniformLocation(graphic.shader.program, "uSampler"), 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphic.indexBuffer);

		var pUniform = gl.getUniformLocation(graphic.shader.program, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.pvMatrix));

		var mvUniform = gl.getUniformLocation(graphic.shader.program, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.transform));
		
		gl.drawArrays(gl[graphic.shader.shapes], 0, graphic.vertexIndices.length);
	});

};

/*
Object.defineProperties(Graphics.prototype, {
	'x': {
		get: function(){
			return this._x;
		},
		set: function(x) {
			this._x = x;
			let t = this._canvas.style.transform;
			t = t.replace(/translateX(.+)/, '') + ' translateX(' + x + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'y': {
		get: function(){
			return this._y;
		},
		set: function(y) {
			this._y = y;
			let t = this._canvas.style.transform;
			t = t.replace(/translateY(.+)/, '') + ' translateY(' + y + 'px)';
			this._canvas.style.transform = t.trim();
		}
	},
	'z': {
		get: function(){
			return this._z;
		},
		set: function(z) {
			this._z = z;
			this._canvas.style.zIndex = z;
		}
	},
	'width': {
		get: function() {
			return this._width;
		},
		set: function(width) {
			this._width = width;
			this._canvas.setAttribute('width', width + 'px');
			this._drawCanvas.setAttribute('width', width + 'px');
		}
	},
	'height': {
		get: function() {
			return this._height;
		},
		set: function(height) {
			this._height = height;
			this._canvas.setAttribute('height', height + 'px');
			this._drawCanvas.setAttribute('height', height + 'px');
		}
	},
	'drawImage': {
		value: function(a) {
			this.width = a.width + 'px';
			this.height = a.height + 'px';
			this._context.clearRect(0, 0, this.width, this.height);
			this._context.drawImage(
				a, 
				0, 
				0, 
				this.width, 
				this.height,
				0,
				0, 
				this.width, 
				this.height);
		}
	},
	'fill': {
		set: function(a) {
			this._context.fillStyle = a;
		}
	},
	'stroke': {
		set: function(a) {
			this._context.strokeStyle = a;
		}
	},
	'renderLines': {
		value: function(face) {
			this._context.beginPath();
			face.forEach(function(v, index){
				let vertex = v[6];
				if(index === 0) {
					this._context.moveTo(vertex[0] * this.width, vertex[1] * this.height);
				} else {
					this._context.lineTo(vertex[0] * this.width, vertex[1] * this.height);
				}
				if(index === face.length-1){
					this._context.lineTo(face[0][6][0] * this.width, face[0][6][1] * this.height);
				}
			}.bind(this));
			this._context.closePath();
			this._context.stroke();
		}
	},
	'renderSolid': {
		value: function(face) {
			this._context.beginPath();
			face.forEach(function(v, index){
				let vertex = v[6];
				if(index === 0) {
					this._context.moveTo(vertex[0] * this.width, vertex[1] * this.height);
				} else {
					this._context.lineTo(vertex[0] * this.width, vertex[1] * this.height);
				}
				if(index === face.length-1){
					this._context.lineTo(face[0][6][0] * this.width, face[0][6][1] * this.height);
				}
			}.bind(this));
			this._context.closePath();
			this._context.fill();
		}
	},
	'render': {
		value: function(face, image, transform){

			if(!face[0][4]) {
				//this.renderSolid(face);
				//this.renderLines(face);
				return;
			}
			this._drawContext.clearRect(0,0,this.width, this.height);
			this._drawContext.save();
		    this._drawContext.beginPath();
			let minX = -1,
				maxX = -1,
				minY = -1,
				maxY = -1,
				minTX = -1,
				minTY = -1,
				maxTX = -1,
				maxTY = -1;
			face.forEach(function(v, index){
				let vertex = v[6],
					x = vertex[0] * this.width,
					y = vertex[1] * this.height,
					tx =  v[4][0] * image.width,
					ty = v[4][1] * image.height;
				
				if(index === 0) {
					this._drawContext.moveTo(tx, ty);
				} else {
					this._drawContext.lineTo(tx, ty);
				}
				if(index === face.length-1){
					this._drawContext.lineTo(face[0][4][0] * this.width, face[0][4][1] * this.height);
				}
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
				if(minTX === -1 || minTX > tx) {
					minTX = tx;
				}
				if(maxTX === -1 || maxTX < tx) {
					maxTX = tx;
				}
				if(minTY === -1 || minTY > ty) {
					minTY = ty;
				}
				if(maxTY === -1 || maxTY < ty) {
					maxTY = ty;
				}
			}.bind(this));
		    
			this._drawContext.closePath();
			
			//this._drawContext.clip();
			

			console.log(minX, minY);
			this._drawContext.drawImage(image, minX, minY, maxX - minX, maxY - minY, 0, 0, maxX - minX, maxY - minY);
			//this._drawContext.setTransform(transform[0],transform[1],transform[4],transform[5],transform[12],transform[13]);
			//minTX, minTY, maxTX - minTX, maxTY-minTY, minX, minY, maxX - minX, maxY - minY);
			//this._context.drawImage(this._drawCanvas, 0, 0);
			this._drawContext.restore();
		}
	},
	'clear': {
		value: function(){
			this._context.clearRect(0, 0, this.width, this.height);
		}
	},
	'drawRect': {
		value: function(a, b, c, d) {
			this._context.fillRect(a, b, c, d);
		}
	}
});
*/


module.exports = Graphics;
'use strict';

let load = require('../../async/load'),
	Viewport = require('../../3d/scene/viewport'),
	textures = {},
	gl = null;

function loadTexture(src){

	if(gl == null) {
		gl = Viewport.getViewport().gl;
	}

	return new Promise((resolve, reject)=>{
		if(!!textures[src]) {
			resolve(textures[src]);
		}
		load(src, 'image').then(image=>{
			let t = gl.createTexture();
			window.texture = t;
			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			textures[src] = t;
			resolve(t);
		});
	});
}

module.exports = {
	load: loadTexture
}
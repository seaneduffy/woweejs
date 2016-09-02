'use strict';

let load = require('../../../async/load');

function Texture() {
	this.materialLoaded = false;
}

Texture.prototype = Object.create(null);

Texture.prototype.load = function(src){

	return new Promise((resolve, reject)=>{
		if(this.materialLoaded === src) {
			resolve();
			return;
		}
		load(src, 'image').then(image=>{
			this.material = image;
			this.materialLoaded = src;
			resolve();
		});
	});
}

module.exports = Texture;
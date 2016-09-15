'use strict';

let DisplayObject3D = wowee.DisplayObject3D;

function Laser() {
	this.displayObject = new DisplayObject3D();
	console.log(this.displayObject);
}

module.exports = Laser;
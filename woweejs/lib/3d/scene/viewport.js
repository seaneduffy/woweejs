'use strict';

let SceneNode = require('./sceneNode');

function Viewport() {
	SceneNode.prototype.constructor.call(this);
}

Viewport.prototype = Object.create(SceneNode.prototype, {
	'camera': {
		get: function(){
			return this._camera;
		},
		set: function(camera){
			this._camera = camera;
		}
	}
});
Viewport.prototype.render = function(){
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
}


module.exports = Viewport;
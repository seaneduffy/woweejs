'use strict';

let SceneNode = require('../scene/sceneNode');

function DisplayObject3D() {
	SceneNode.prototype.constructor.call(this);
	this.graphics = new Graphics();
}

DisplayObject3D.prototype = Object.create(SceneNode.prototype, {
	'model': {
		get: function(){
			return this._model;
		},
		set: function(model){
			this._model = model;
		}
	},
	'graphics': {
		get: function(){
			return this._graphics;
		},
		set: function(graphics){
			this._graphics = graphics;
		}
	}
});

DisplayObject3D.prototype.render = function(camera){
	if(!!this.model) {
		this.graphics.fill = 'red';
		this.graphics.draw(camera.toDisplay(this.model, this.transform));
	}
	this.children.forEach(function(displayObject3D){
		displayObject3D.render(camera);
	});
};

module.exports = DisplayObject3D;
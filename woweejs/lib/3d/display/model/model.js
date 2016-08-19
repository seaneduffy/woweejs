'use strict';

function Model() {
}

Object.defineProperties(Model.prototype, {
	'shapes': {
		get: function(){
			if(!!this._shapes) {
				return this._shapes;
			}
			return this._shapes = [];
		}
	}
});

Model.prototype.render = function(graphics, camera, transform) {
	graphics.fill = 'red';
	graphics.clear();
	this.shapes.forEach(function(shape) {
		graphics.draw(camera.toDisplay(shape, transform));
	});
};

var c = 0;

module.exports = Model;
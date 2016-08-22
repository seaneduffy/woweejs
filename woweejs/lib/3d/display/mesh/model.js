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
	graphics.clear();
	this.shapes.forEach(function(shape) {
		graphics.fill = 'red';
		graphics.stroke = 'blue';
		graphics.renderSolid(camera.toDisplay(shape, transform));
		graphics.renderLines(camera.toDisplay(shape, transform));
	});
};

module.exports = Model;
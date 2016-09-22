'use strict';

function Material() {

}

Object.defineProperties(Material.prototype, {
	'shader': {
		get: function() {
			return this._shader;
		},
		set: function(s) {
			this._shader = s;
		}
	},
	'diffuseColor': {
		get: function() {
			return this._diffuseColor;
		},
		set: function(c) {
			this._diffuseColor = c;
		}
	}
});

Material.prototype.apply = function(transformMat4){

	gl.useProgram(this.shader.program);

	if(!!this.diffuseColor && this.shader.hasUniform('u_mtr_diffuse')) {
		this.shader.setUniformVec4('u_mtr_diffuse', this.diffuseColor);
	}

	this.shader.setUniformMat4('u_rp_mvp_matrix', new Float32Array(transformMat4));
};

module.exports = Material;
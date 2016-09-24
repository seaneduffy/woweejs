'use strict';

Material.DIFFUSE_MAP_TMU  = 0;
Material.SPECULAR_MAP_TMU = 1;
Material.NORMAL_MAP_TMU   = 2;

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

Material.prototype.apply = function(mvpMat4, modelMat4, invModelMat4, eyePosition){

	this.shader.bind();

	if(!!this.diffuseColor && this.shader.hasUniform('u_mtr_diffuse')) {
		this.shader.setUniformVec4('u_mtr_diffuse', this.diffuseColor);
	}
	if(!!this.specularColor && this.shader.hasUniform("u_mtr_specular")) {
		shader.setUniformVec4("u_mtr_specular", this.specularColor);
	}
	if(!!this.ambientColor && this.shader.hasUniform("u_mtr_ambient")) {
		shader.setUniformVec4("u_mtr_ambient", this.ambientColor);
	}
	if(!!this.shininess && this.shader.hasUniform("u_mtr_shininess")) {
		this.shader.setUniform1f("u_mtr_shininess", this.shininess);
	}
	if(this.shader.hasUniform("u_diffuse_texture")) {
		this.shader.setUniform1i("u_diffuse_texture", Material.DIFFUSE_MAP_TMU);
	}
	if(this.shader.hasUniform("u_specular_texture")) {
		this.shader.setUniform1i("u_specular_texture", Material.SPECULAR_MAP_TMU);
	}
	if(this.shader.hasUniform("u_normal_texture")) {
		this.shader.setUniform1i("u_normal_texture", Material.NORMAL_MAP_TMU);
	}
	if(this.shader.hasUniform("u_rp_mvp_matrix")) {
		this.shader.setUniformMat4('u_rp_mvp_matrix', new Float32Array(mvpMat4));
	}
	if(this.shader.hasUniform("u_rp_model_matrix")) {
		this.shader.setUniformMatrix4("u_rp_model_matrix", modelMat4);
	}
	if(this.shader.hasUniform("u_rp_inverse_model_matrix")) {
		this.shader.setUniformMatrix4("u_rp_inverse_model_matrix", invModelMat4);
	}
	if(this.shader.hasUniform("u_rp_world_space_eye")) {
		this.shader.setUniformVec4("u_rp_world_space_eye", eyePosition);
	}

	
};

Material.prototype.remove = function(){
	this.shader.unbind();
}

module.exports = Material;
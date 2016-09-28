varying highp vec2 v_texcoords;
uniform sampler2D u_diffuse_texture;
void main(void) {
	gl_FragColor = texture2D(u_diffuse_texture, vec2(v_texcoords.s, v_texcoords.t));
}
varying highp vec2 v_tex_coord;
uniform sampler2D u_diffuse_texture;
void main(void) {
	gl_FragColor = texture2D(u_diffuse_texture, vec2(v_tex_coord.s, v_tex_coord.t));
}
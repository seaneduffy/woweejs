attribute vec3 a_position;
attribute vec2 a_texcoords;
uniform mat4 u_rp_mvp_matrix;
varying highp vec2 v_texcoords;
void main(void) {
	gl_Position = u_rp_mvp_matrix * vec4(a_position, 1.0);
	v_texcoords = a_texcoords;
}
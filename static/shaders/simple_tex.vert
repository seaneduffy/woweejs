attribute vec3 a_vert_pos;
attribute vec2 a_tex_coord;
uniform mat4 u_rp_mvp_matrix;
varying highp vec2 v_tex_coord;
void main(void) {
	gl_Position = u_rp_mvp_matrix * vec4(a_vert_position, 1.0);
	vTextureCoord = a_tex_coord;
}
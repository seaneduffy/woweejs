/*
 * ===========================================================
 * GLSL Vertex Shader
 *  This source code is released under the MIT License.
 *  Copyright (c) 2015 Guilherme R. Lampert.
 * ===========================================================
 */

precision mediump float;

// Vertex in:
attribute vec3 a_position;

// Render params:
uniform mat4 u_rp_mvp_matrix;
uniform float u_stroke;

void main() {
	gl_Position = vec4(u_rp_mvp_matrix * vec4(a_position, 1.0));
	gl_PointSize = u_stroke;
}

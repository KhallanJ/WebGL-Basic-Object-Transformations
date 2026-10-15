#version 300 es

// =================================================================================================
// FRAGMENT SHADER
// Runs once for every PIXEL covered by a shape. Its only job is to decide that pixel's colour.
// =================================================================================================

precision mediump float;

// The colour from the vertex shader, already blended between the vertices of the triangle.
in vec3 vColor;

// The colour that gets written to the screen.
out vec4 fColor;

void main() {
    fColor = vec4(vColor, 1.0);   // 1.0 = fully opaque
}

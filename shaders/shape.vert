#version 300 es

// =================================================================================================
// VERTEX SHADER
// Runs once for EVERY vertex of EVERY shape. Its job: take the vertex's position (in the shape's
// own "model space") and work out where it ends up on screen, by applying the shape's
// scale, then rotation, then position (translation).
// =================================================================================================

// ---- Per-vertex inputs (these come from the vertex buffer, see shape.ts) ----------------------
in vec3 aPosition;   // where this vertex is, relative to the centre of the shape
in vec3 aColor;      // this vertex's colour (r, g, b)

// ---- Output: sent to the fragment shader, automatically blended (interpolated) across faces ---
out vec3 vColor;

// ---- Uniforms: the same value for every vertex of one shape (set once per draw call) ----------
uniform vec3 uPosition;   // translation along x, y, z
uniform vec3 uRotation;   // rotation angles (in RADIANS) around the x, y, z axes
uniform vec3 uScale;      // scale factor along x, y, z

void main() {
    // Just pass the colour along; the GPU interpolates it between vertices for us.
    vColor = aColor;

    // NOTE: GLSL matrices are written COLUMN by COLUMN. So each line below is one column,
    // not one row. (That's why the translation numbers sit on the bottom line.)

    // ---- Translation matrix: moves the shape ----------------------------------------------
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        uPosition.x, uPosition.y, uPosition.z, 1.0
    );

    // ---- Scale matrix: stretches/squashes the shape along each axis -----------------------
    mat4 scale = mat4(
        uScale.x, 0.0, 0.0, 0.0,
        0.0, uScale.y, 0.0, 0.0,
        0.0, 0.0, uScale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // ---- Rotation around the x-axis -------------------------------------------------------
    float cosX = cos(uRotation.x);
    float sinX = sin(uRotation.x);
    mat4 rotationX = mat4(
        1.0, 0.0,   0.0,  0.0,
        0.0, cosX,  sinX, 0.0,
        0.0, -sinX, cosX, 0.0,
        0.0, 0.0,   0.0,  1.0
    );

    // ---- Rotation around the y-axis -------------------------------------------------------
    float cosY = cos(uRotation.y);
    float sinY = sin(uRotation.y);
    mat4 rotationY = mat4(
        cosY,  0.0, -sinY, 0.0,
        0.0,   1.0, 0.0,   0.0,
        sinY,  0.0, cosY,  0.0,
        0.0,   0.0, 0.0,   1.0
    );

    // ---- Rotation around the z-axis -------------------------------------------------------
    float cosZ = cos(uRotation.z);
    float sinZ = sin(uRotation.z);
    mat4 rotationZ = mat4(
        cosZ,  sinZ, 0.0, 0.0,
        -sinZ, cosZ, 0.0, 0.0,
        0.0,   0.0,  1.0, 0.0,
        0.0,   0.0,  0.0, 1.0
    );

    // Combine the three rotations into one matrix.
    mat4 rotation = rotationX * rotationY * rotationZ;

    // ---- Put it all together --------------------------------------------------------------
    // Matrices are applied RIGHT-TO-LEFT, so the order of operations on the vertex is:
    //   1. scale it      (while it's still centred on the origin)
    //   2. rotate it     (spins around its own centre)
    //   3. translate it  (finally move it to where it should be)
    // If you did translate first, the shape would orbit the origin instead of spinning in place.
    gl_Position = translation * rotation * scale * vec4(aPosition, 1.0);
}

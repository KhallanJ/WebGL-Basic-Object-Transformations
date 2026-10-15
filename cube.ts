import { Shape, type Color, type Point, type ShapeOptions } from './shape';

//The code for the colours
export const CUBE_RAINBOW: Color[] = [
    [1.0, 0.0, 0.0], // red
    [1.0, 0.5, 0.0], // orange
    [1.0, 1.0, 0.0], // yellow
    [0.0, 1.0, 0.0], // green
    [0.0, 1.0, 1.0], // cyan
    [0.0, 0.0, 1.0], // blue
    [0.6, 0.0, 1.0], // purple
    [1.0, 0.0, 1.0], // magenta
];

//Same colours as above, but slightly different
export const CUBE_COOL: Color[] = [
    [0.0, 0.2, 0.6], 
    [0.0, 0.7, 0.7], 
    [0.1, 0.8, 0.3],
    [0.9, 0.9, 1.0], 
    [0.4, 0.1, 0.7], 
    [0.2, 0.5, 1.0], 
    [0.8, 0.8, 0.2], 
];

const CORNERS: Point[] = [
    [-0.5, -0.5, -0.5], // Back left bottom
    [+0.5, -0.5, -0.5], // Back right bottom
    [-0.5, +0.5, -0.5], // Back left top
    [+0.5, +0.5, -0.5], // Back right top
    [-0.5, -0.5, +0.5], // Fron t left bottom
    [+0.5, -0.5, +0.5], // Front right bottom
    [-0.5, +0.5, +0.5], // Front left top
    [+0.5, +0.5, +0.5], // Front right top
];

//Each of the faces
const FACES: number[][] = [
    [0, 1, 3, 2], // back
    [4, 5, 7, 6], // front
    [0, 2, 6, 4], // left
    [1, 3, 7, 5], // right
    [0, 1, 5, 4], // bottom
    [2, 3, 7, 6], // top
];

// Generates the shape verticies
function generateCubeIndices(): number[] {
    const indices: number[] = [];

    for (const [a, b, c, d] of FACES) {
        indices.push(a, b, c); 
        indices.push(a, c, d); 
    }

    return indices;
}

//Export the shape class
export class Cube extends Shape {
    
    public constructor(gl: WebGL2RenderingContext, palette: Color[], options: ShapeOptions = {}) {
        super(gl, CORNERS, palette, generateCubeIndices(), options);
    }
}
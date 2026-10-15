import { Shape, type Color, type Point, type ShapeOptions } from './shape';

//Colours for pyramids
export const PYRAMID_NEON: Color[] = [
    [1.0, 1.0, 0.0], // yellow
    [1.0, 0.0, 0.3], // hot pink
    [0.0, 1.0, 0.4], // neon green
    [0.0, 0.5, 1.0], // electric blue
    [0.8, 0.0, 1.0], // purple
];

// Same as the cube class, same colours but varients
export const PYRAMID_OCEAN: Color[] = [
    [1.0, 1.0, 1.0], 
    [0.0, 0.3, 0.8], 
    [0.0, 0.8, 0.8], 
    [0.1, 0.6, 0.2], 
    [0.3, 0.2, 0.6], 
];

//Pyramid points
const POSITIONS: Point[] = [
    [ 0.0, +0.5,  0.0], 
    [-0.5, -0.5, -0.5], 
    [+0.5, -0.5, -0.5], 
    [+0.5, -0.5, +0.5], 
    [-0.5, -0.5, +0.5], 
];

const INDICES: number[] = [
    0, 1, 2, // back side
    0, 2, 3, // right side
    0, 3, 4, // front side
    0, 4, 1, // left side

    // The square base - split into 2 triangles
    1, 2, 3,
    1, 3, 4,
];

//Export Pyramid class
export class Pyramid extends Shape {
   
    public constructor(gl: WebGL2RenderingContext, palette: Color[], options: ShapeOptions = {}) {
        super(gl, POSITIONS, palette, INDICES, options);
    }
}
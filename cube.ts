export class Cube {
    private verticies: number[] = [
        //Front face, using two triangles
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,

        -0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
    ];

    constructor() {
        // 
    }
}
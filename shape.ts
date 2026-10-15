import { vec3, type Vec3 } from 'mv-redux';
import { compileShader, linkProgram } from 'mv-redux/init';

import vertSource from './shaders/shape.vert';
import fragSource from './shaders/shape.frag';

export type Point = [number, number, number];
export type Color = [number, number, number];

export interface ShapeOptions {
    position?: Vec3;
    rotation?: Vec3;
    scale?: Vec3;
}

export class Shape {
    //Transformations of the shapes
    public position: Vec3;
    public rotation: Vec3;
    public scale: Vec3;

    //WebGL properties
    protected gl: WebGL2RenderingContext;
    protected program: WebGLProgram;
    protected vao: WebGLVertexArrayObject;
    protected indexCount: number;
    protected uLocations: {
        uPosition: WebGLUniformLocation | null,
        uRotation: WebGLUniformLocation | null,
        uScale: WebGLUniformLocation | null,
    };


    //Compile all the shapes
    private static sharedProgram: WebGLProgram | null = null;

    public constructor( gl: WebGL2RenderingContext, positions: Point[], colors: Color[], indices: number[], options: ShapeOptions = {}) {
        this.gl = gl;

        // Starting transformation
        this.position = options.position ?? vec3(0, 0, 0);
        this.rotation = options.rotation ?? vec3(0, 0, 0);
        this.scale = options.scale ?? vec3(1, 1, 1);

        //Shaders
        let program = Shape.sharedProgram;
        if (!program) {
            program = linkProgram(
                gl,
                compileShader(gl, gl.VERTEX_SHADER, vertSource),
                compileShader(gl, gl.FRAGMENT_SHADER, fragSource),
            );
            Shape.sharedProgram = program;
        }
        this.program = program;

        // Find where the three uniforms are and ser them when drawing
        this.uLocations = {
            uPosition: gl.getUniformLocation(this.program, 'uPosition'),
            uRotation: gl.getUniformLocation(this.program, 'uRotation'),
            uScale: gl.getUniformLocation(this.program, 'uScale'),
        };

        // Build the vertex data
        const vertexData = new Float32Array(positions.length * 6);
        positions.forEach((position, i) => {
            const color = colors[i % colors.length];
            vertexData.set(position, i * 6);
            vertexData.set(color, i * 6 + 3); 
        });

        this.indexCount = indices.length;

        
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        // Read from buffer
        const aPosition = gl.getAttribLocation(this.program, 'aPosition');
        const aColor = gl.getAttribLocation(this.program, 'aColor');

        const F32 = Float32Array.BYTES_PER_ELEMENT;
        const stride = F32 * 6;                    
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, stride, F32 * 0);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, F32 * 3);
        gl.enableVertexAttribArray(aPosition);
        gl.enableVertexAttribArray(aColor);

        //Add them to the buffer
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    //Draws the shapes
    public draw(): void {
        const gl = this.gl;
        const { uPosition, uRotation, uScale } = this.uLocations;

        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao); // restores the buffers + attribute setup from the constructor

        // Send the current transform to the vertex shader.
        gl.uniform3fv(uPosition, this.position);
        gl.uniform3fv(uRotation, this.rotation);
        gl.uniform3fv(uScale, this.scale);

        // Draw the elementes
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

        gl.bindVertexArray(null);
        gl.useProgram(null);
    }
}
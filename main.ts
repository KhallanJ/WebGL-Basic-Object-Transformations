import { initCanvas } from 'mv-redux/init';
import { vec3 } from 'mv-redux';

import { Cube, CUBE_RAINBOW, CUBE_COOL } from './cube';
import { Pyramid, PYRAMID_NEON, PYRAMID_OCEAN } from './pyramid';

// WebGL
const canvas = document.querySelector('canvas')!;
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height); // draw onto the whole canvas
gl.clearColor(0.6, 0.6, 0.6, 1.0); // grey background
gl.enable(gl.DEPTH_TEST);

//Creates the shapes
const cubeA = new Cube(gl, CUBE_RAINBOW);
const cubeB = new Cube(gl, CUBE_COOL);
const pyramidA = new Pyramid(gl, PYRAMID_NEON);
const pyramidB = new Pyramid(gl, PYRAMID_OCEAN);

//Animation
function draw(time = 0): void {
    //Convert to seconds
    const t = time / 1000;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Cube A: moves in a big circle, grows and shrinks evenly whiling spinning on all axes
    const pulseA = 0.25 + 0.1 * Math.sin(t * 2); //ocillates
    cubeA.position = vec3(0.5 * Math.cos(t), 0.5 * Math.sin(t), 0.2 * Math.sin(t));
    cubeA.scale = vec3(pulseA, pulseA, pulseA);                       
    cubeA.rotation = vec3(t, t * 0.5, Math.sin(t) * Math.PI);// Swings back and forth

    //Cube B: moves up/down and left/right, while squeezing and stretching
    cubeB.position = vec3(0.55 * Math.sin(t * 0.7), -0.4 + 0.15 * Math.sin(t * 3), -0.2);
    cubeB.scale = vec3(0.3 + 0.1 * Math.sin(t * 3), 0.3 + 0.1 * Math.cos(t * 3), 0.2,);
    cubeB.rotation = vec3(t * 0.8, t * 1.2, t * 0.4);

    //Pyramid A: goes up and down on the left side while stretching
    pyramidA.position = vec3(-0.6, 0.6 * Math.sin(t * 1.1), 0.0);
    pyramidA.scale = vec3(0.3, 0.35 + 0.1 * Math.sin(t * 2), 0.3);     
    pyramidA.rotation = vec3(0.0, t, Math.sin(t * 0.5) * 0.6);

    //Pyramid B: travels along a figure-8 path, pulses its size, while rotating
    const pulseB = 0.3 + 0.08 * Math.cos(t * 2.5);
    pyramidB.position = vec3(0.5 * Math.sin(t * 0.9), 0.5 * Math.sin(t * 1.8), 0.1);
    pyramidB.scale = vec3(pulseB, pulseB * 1.2, pulseB);               
    pyramidB.rotation = vec3(t * 1.3, t * 0.6, t);

    //Draw the shapes
    cubeA.draw();
    cubeB.draw();
    pyramidA.draw();
    pyramidB.draw();

    window.requestAnimationFrame(draw);
}

draw();
/* eslint-disable no-undef */
import { createShaderProgramFromScripts } from './webglutils/createshader';
import { getVertexShader, getFragmentShader } from './shaders/renderer2D';
import { getRenderingContext } from './webglutils/support';
import { createPrograms } from './webglutils/createprograms';
import Program from './webglutils/program';

// attribute location object enumeration
const ATTRIBUTE_LOCATION = {
  POSITION: 0,
  COLOR: 1,
  UV: 2,
};

/**
 * Renderer object is an interface between WebGL and the graphics program.
 * It is in charge of shader programming, and drawing colors and geometry on screen.
 */
export default class Renderer2D {
  constructor(canvas) {
    // scene object
    this.scene;

    // canvas object
    this.canvas = canvas;

    // reference to the WebGL
    this.gl;

    // dimentions
    this.resolution = [this.canvas.element.width, this.canvas.element.height];

    // basic program
    this.programs = {};
    this.programsInUse = [];
    this.customProgramCount = 0;

    // changes only if there is multiple textures in the scene
    this.previousTextureNumber = null;

    // measurements
    this.frameCount = 0;
    this.previousTime = 0;
    this.drawCalls = 0;

    // fps
    this.frameRate = 0;
    this.tickmaxsamples = 100;
    this.tickindex = 0;
    this.ticksum = 0;
    this.ticklist = Array(100).fill(0);

    // switches
    this.stopRenderLoopGiven = false;

    this.init();
  }

  /**
   * Is called in construction
   */
  init() {
    if (process.env.NODE_ENV === 'test') { return; }

    const gl = this.setupGL();
    if (!gl) return;

    this.programs = createPrograms(gl);
  }

  /**
   * sets this.gl to be a WebGL2RenderingContext interface
   * @returns {WebGL2RenderingContext}
   */
  setupGL() {
    const glOptions = {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: this.canvas.preserveDrawingBuffer 
    };
    
    const glContext = getRenderingContext(glOptions);
    if (!glContext) return;

    const gl = this.canvas.element.getContext(glContext, glOptions);

    // background color
    const c = this.canvas.backgroundColor;

    // set the gl clear color and clear once to reset canvas
    const alpha = this.canvas.transparent ? 0.0 : c[3];
    gl.clearColor(c[0], c[1], c[2], alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // backfaces are not rendered
    gl.enable(gl.CULL_FACE);

    // stacking up colors
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    this.gl = gl;
    return gl;
  }

  /**
   * Sets buffers and attributes for each draw call
   * @param {WebGL2RenderingContext} gl 
   * @param {object} info 
   */
  setBuffersAndAttributes(gl, info) {
    const positionBuffer = info.position;
    const indicesBuffer = info.index;
    const uvBuffer = info.uv;
    const colorBuffer = info.color;

    // position attribute in to the shader program
    gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.POSITION);
    // always bind before setting attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(ATTRIBUTE_LOCATION.POSITION, 2, gl.FLOAT, false, 0, 0);

    if (uvBuffer) {
      gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.UV);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.vertexAttribPointer(ATTRIBUTE_LOCATION.UV, 2, gl.FLOAT, false, 0, 0);
    }

    if (colorBuffer) {
      gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.COLOR);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.vertexAttribPointer(ATTRIBUTE_LOCATION.COLOR, 4, gl.FLOAT, false, 0, 0);
    }

    if (info.drawElements) {
      // bind element array buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    }
  }

  /**
   * Sets uniforms for each animation frame
   * 
   * @param {WebGL2RenderingContext} gl 
   * @param {Object} program program object
   */
  setGeneralUniforms(gl, program) {
    gl.uniform2fv(program.U_RESOLUTION, this.resolution);
    gl.uniform1f(program.U_PIXELRATIO, this.canvas.pixelRatio);

    if (program.U_TIME) {
      gl.uniform1f(program.U_TIME, this.previousTime / 1000);
    }
  }

  /**
   * Sets uniforms for each draw call. 
   * 
   * Could be coordinated better, no tall need to be set all the times.
   * 
   * @param {WebGL2RenderingContext} gl 
   * @param {Object} program
   * @param {AbstractShape} shape
   */
  setProgramUniforms(gl, program, shape) {
    // if shape has parent take parents rotation in count
    if (shape.hasParent) {
      gl.uniform2fv(program.U_PARENT_POS, shape.parent.position.getAsArray());
      gl.uniform1f(program.U_PARENT_ROT, shape.parent.rotation);
    }

    gl.uniform2fv(program.U_POSITION, shape.position.getAsArray());
    gl.uniform2fv(program.U_SCALE, shape.scale.getAsArrayScaled(shape.scaleFactor));
    gl.uniform1f(program.U_ROTATION, shape.rotation);
    if (program.U_COLOR) {
      gl.uniform4fv(program.U_COLOR, shape.color.getAsArray());
    }
    
    if (shape.programInfo.hasTexture) {
      const texture = shape.programInfo.texture;
      const no = texture.number;

      if (this.previousTextureNumber !== no) {
        gl.activeTexture(no);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.uniform1i(program.U_TEXTURE, 0);
      }
    }
  }

  /**
   * renders teh pending image once
   * has to be given to the rendering loop separately
   */
  render() {
    const gl = this.gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clears scene with background color
    if (this.canvas.clearBeforeRender) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    const drawCalls = this.scene.shapes.length;
    // draw things only if there is something to draw
    if (drawCalls > 0) {

      // set general uniforms for all programs in use
      this.programsInUse.forEach(program => {
        gl.useProgram(program[0].WebGL_Program);
        this.setGeneralUniforms(gl, program[0]);
      });

      // draw calls for each shape
      this.scene.shapes.forEach(shape => {
        const programInfo = shape.programInfo;
        const program = programInfo.program;
        const WebGL_Program = program.WebGL_Program;

        // specify, witch program is in use
        gl.useProgram(WebGL_Program);

        // then setup the correct variables for shader programs
        this.setBuffersAndAttributes(gl, programInfo);
        this.setProgramUniforms(gl, program, shape);

        // check how the elements are drawn
        if (programInfo.drawElements) {

          // draws indexed positions
          gl.drawElements(programInfo.drawMode, shape.amountOfVertices, gl.UNSIGNED_SHORT, 0);

        } else {

          // draws positions in order, requires an oredered array
          gl.drawArrays(programInfo.drawMode, 0, shape.vertexData.positions.length / 2);

        }
      });

      // only then add to the frame count
      this.frameCount += 1;
    }

    // keep track of the draw calls
    this.drawCalls = drawCalls;
  }

  /**
   * Render loop initialzer
   * @param {(delta: number) => void} func things that happen between frames
   */
  runRenderLoop(func) {
    // Resets previous commands if renderloop was stopped
    this.stopRenderLoopGiven = false;

    // starts looping
    window.requestAnimationFrame((currentTime) => {
      if (this.stopRenderLoopGiven) {return;}

      const delta = (currentTime - this.previousTime) / 1000;
      this.updateFrameRate(delta);
      this.previousTime = currentTime;

      // canvas element ignores the scaling from pixel ratio
      this.resolution[0] = this.canvas.element.width;
      this.resolution[1] = this.canvas.element.height;

      // the given function inside runRenderLoop call
      func(delta);

      this.runRenderLoop(func);
    });
  }

  /**
   * Draws points directly to the canvas from positition and color data.
   * @param {Array} positionsArray 
   * @param {Array} colorsArray 
   * @param {number} size 
   */
  drawPoints(positionsArray, colorsArray, size) {
    if (positionsArray.length * 2 !== colorsArray.length) { console.error(`Points array lengths don't match pos: ${positionsArray.length} and color: ${colorsArray.length}`); }

    const gl = this.gl;
    // const program = this.programs.points;
    const program = this.programs.points;
    const WebGL_Program = program.WebGL_Program;

    const positions = positionsArray;
    const colors = colorsArray;

    gl.useProgram(WebGL_Program);

    // positions buffer
    const positionsBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(ATTRIBUTE_LOCATION.POSITION, 2, gl.FLOAT, false, 0, 0);

    // colors buffer
    const colorBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.COLOR);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(ATTRIBUTE_LOCATION.COLOR, 4, gl.FLOAT, true, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.uniform1f(program.U_SCALE, size * this.canvas.pixelRatio);
    gl.uniform2fv(program.U_RESOLUTION, this.resolution);
    gl.uniform1f(program.U_PIXELRATIO, this.canvas.pixelRatio);

    gl.drawArrays(gl.POINTS, 0, positions.length / 2);

    // free the memory
    gl.deleteBuffer(positionsBuffer);
    gl.deleteBuffer(colorBuffer);
  }

  /**
   * Draw lines directly to the canvas from positions data.
   * Lines can be only 1px thick rendered with this function.
   * @param {Array} positionsArray 
   * @param {number} color 
   */
  drawLines(positionsArray, lineColor = null) {
    const gl = this.gl;
    const program = this.programs.lines;
    const WebGL_Program = program.WebGL_Program;

    const lColor = lineColor ? lineColor.getAsArray() : [1, 1, 1, 1];
    const positions = positionsArray;

    gl.useProgram(WebGL_Program);

    // positions buffer
    const positionsBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(ATTRIBUTE_LOCATION.POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(ATTRIBUTE_LOCATION.POSITION, 2, gl.FLOAT, false, 0, 0);

    gl.uniform4fv(program.U_COLOR, lColor);
    gl.uniform2fv(program.U_RESOLUTION, this.resolution);
    gl.uniform1f(program.U_PIXELRATIO, this.canvas.pixelRatio);

    gl.drawArrays(gl.LINES, 0, positions.length / 2);

    // free the memory
    gl.deleteBuffer(positionsBuffer);
  }

  /**
   * Updates frame rate
   * @param {number} delta The time it takes to draw a single frame 
   */
  updateFrameRate(delta) {
    this.ticksum -= this.ticklist[this.tickindex];
    this.ticksum += delta;
    this.ticklist[this.tickindex] = delta;

    this.tickindex++;
    if (this.tickindex === this.tickmaxsamples) this.tickindex = 0;

    this.frameRate = parseInt(10000 * 1 / this.ticksum / this.tickmaxsamples, 10);
  }

  /**
   * Stops the render loop
   */
  stop() {
    this.stopRenderLoopGiven = true;
  }

  /**
   * Destroys the renderer and ends the render loop
   */
  destroy() {
    this.stop();

    // delete programs
    Object.values(this.programs).forEach(p => this.gl.deleteProgram(p.program));

    this.gl.getExtension('WEBGL_lose_context').loseContext();
    this.gl = null;

    this.canvas = null;
    this.programs = null;
    this.resolution = null;
    this.ticklist = null;
  }

  /**
   * Creates and sets up a custom shader program
   * @param {string} vertexShader 
   * @param {string} fragmentShader 
   */
  createShaderProgram(vertexShader, fragmentShader) {
    const gl = this.gl;
    const vert = vertexShader || getVertexShader('texture');
    const frag = fragmentShader || getFragmentShader('basic');

    const custom = createShaderProgramFromScripts(gl, vert, frag);
    const program = new Program(custom);
    program.setUniformLocationsBasic(gl, false, false, false);
    program.setUniformLocationTime(gl);

    this.programs[`c${this.customProgramCount}`] = program;
    this.customProgramCount++;

    return program;
  }

  /**
   * Adds program to in use list and keeps track of the amount of shapes
   * That use that program
   * 
   * @param {Object} program 
   */
  addProgramInUse(program) {
    const idx = this.programsInUse.indexOf(p => p[0] == program);
    if (idx !== -1) {
      this.programsInUse[idx][1] += 1;
    } else this.programsInUse.push([program, 1]);
  }

  /**
   * Deletes program from the in-use list and keeps track of the amount of shapes
   * that use the specific program
   * 
   * @param {Object} program 
   */
  deleteProgramFromUse(program) {
    const idx = this.programsInUse.indexOf(program);
    if (idx === -1) return;
    
    if (this.programsInUse[idx][1] === 1) {
      this.programsInUse.splice(idx, 1);
    } else {
      this.programsInUse[idx][1] -= 1;
    }
  }
}
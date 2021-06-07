import AbstractShape from './abstractshape';
import VertexData from './geometry/vertexdata';
import Color from '../utils/color';
import Vec2 from '../utils/math/vector2';

export default class Rectangle extends AbstractShape {
  constructor(scene, options) {
    super(scene);

    // options object
    this.options = options || {};

    // different options 
    this.width = this.options.width || 10.0;
    this.height = this.options.height || 10.0;
    this.color = this.options.color || new Color(0.0, 0.5, 0.5);

    // variables you need to change
    this.position = new Vec2(0, 0);
    this.rotation = 0;

    this.init();
  }

  init() {
    const data = this.buildGeometry();
    this.buildProgramInfo(data);
  }

  buildGeometry() {
    const W = this.width;
    const H = this.height;

    const positions = [];
    const indices = [0, 1, 2, 0, 3, 1];

    // four corners
    positions.push(-W/2, -H/2);
    positions.push(W/2, H/2);
    positions.push(-W/2, H/2);
    positions.push(W/2, -H/2);

    const vertexData = new VertexData(positions, indices);
    this.vertexData = vertexData;

    // save the number of vertices shape would have on screen
    this.amountOfVertices = indices.length;

    return vertexData;
  }

  /**
   * Builds program-info -object witch passes information about renderig to the renderer.
   * @param {VertexData} data 
   */
  buildProgramInfo(data) {
    if (process.env.NODE_ENV === 'test') { this.programInfo = {}; return; }

    const gl = this.scene.renderer.gl;
    const program = this.scene.renderer.programs.basic;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

    this.programInfo.position = positionBuffer;
    this.programInfo.index = indicesBuffer;
    this.programInfo.drawMode = gl.TRIANGLES;
    this.programInfo.program = program;
    this.programInfo.drawElements = true;
  }

  /**
   *  Adds to vertexData information about texture coordinates in circle to VertexData-object.
   *  Necessary only if there is a texture or personal shader.
   */
  buildUVBuffer() {
    const gl = this.scene.renderer.gl;

    const uvs = [
      0, 1,
      1, 0,
      0, 0,
      1, 1,
    ];

    this.vertexData.uvs = uvs;
    // bind the buffer
    this.bindUVBuffer(uvs, gl);
  }
}
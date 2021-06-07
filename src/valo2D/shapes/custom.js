import AbstractShape from './abstractshape';
import Vec2 from '../utils/math/vector2';
import Color from '../utils/color';

export default class CustomShape extends AbstractShape {
  constructor(scene, vertexData) {
    super(scene);

    // variables you need to change
    this.position = new Vec2(0, 0);
    this.rotation = 0;

    this.vertexData = vertexData;

    // grey default color
    this.color = new Color(0.5, 0.5, 0.5, 1);

    this.init();
  }

  init() {
    const data = this.vertexData;
    this.amountOfVertices = data.indices.length;
    this.buildProgramInfo(data);
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
    this.programInfo.program = program;
    this.programInfo.drawMode = gl.TRIANGLES;
    this.programInfo.drawElements = true;

    if (data.uvs) {
      this.bindUVBuffer(data.uvs, gl);
    }
  }
}
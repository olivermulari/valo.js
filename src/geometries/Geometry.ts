import { BufferAttribute, Float32BufferAttribute, Uint16BufferElementAttribute } from './BufferAttribute';
import { Program } from '../renderers/webgl/Program';

export const ATTRIBUTE_LOCATION = {
  POSITION: 0,
  INDICES: 1,
  NORMAL: 2,
};

let _geometryID = 0;

/**
 * Geometry class that utilises buffers to store data
 */
export class Geometry {

  id: number;
  vao: WebGLVertexArrayObject | null;
  attributes: { [key: number]: BufferAttribute };
  amountOfVertices: number;
  hasPositions: boolean;
  hasIndices: boolean;
  hasNormals: boolean;
  isBuffersSet: boolean;
  isBuffersBind: boolean;

  constructor() {

    this.id = ++_geometryID;

    this.vao = null;
    this.attributes = {};

    this.amountOfVertices = 0;

    this.hasPositions = false;
    this.hasNormals = false;
    this.hasIndices = false;

    this.isBuffersSet = false;
    this.isBuffersBind = false;

  }

  /**
   * Sets buffers
   */
  setBuffers(gl: WebGL2RenderingContext): void {

    if (this.isBuffersSet) return;

    const vao = gl.createVertexArray();

    gl.bindVertexArray(vao);

    this.vao = vao;

    if (this.hasPositions) {
      this.attributes[ATTRIBUTE_LOCATION.POSITION].createBuffer(gl);
    }

    if (this.hasNormals) {
      this.attributes[ATTRIBUTE_LOCATION.NORMAL].createBuffer(gl);
    }

    if (this.hasIndices) {
      this.attributes[ATTRIBUTE_LOCATION.INDICES].createBuffer(gl);
    }

    this.isBuffersSet = true;

    gl.bindVertexArray(null);

  }

  /**
   * Binds the buffers with the given program
   */
  bindBuffers(gl: WebGL2RenderingContext, program: Program): void {

    if (this.isBuffersBind) return;

    gl.bindVertexArray(this.vao);

    if (this.hasPositions && program.A_POSITION !== -1) {
      this.attributes[ATTRIBUTE_LOCATION.POSITION].bindBufferWithProgram(gl, this, program);
    }

    if (this.hasNormals && program.A_NORMAL !== -1) {
      this.attributes[ATTRIBUTE_LOCATION.NORMAL].bindBufferWithProgram(gl, this, program);
    }

    if (this.hasIndices) {
      // doesn't actually need binding at init -> not a vao
    }

    gl.bindVertexArray(null);

  }

  // attribute setters

  setPositionAttribute( array: Float32Array, size: number ): void {

    this.attributes[ATTRIBUTE_LOCATION.POSITION] = new Float32BufferAttribute(array, size, 'position');
    this.hasPositions = true;

  }

  setNormalsAttribute( array: Float32Array, size: number ): void {

    this.attributes[ATTRIBUTE_LOCATION.NORMAL] = new Float32BufferAttribute(array, size, 'normal');
    this.hasNormals = true;

  }

  setIndicesAttribute( array: Uint16Array, size: number ): void {

    this.attributes[ATTRIBUTE_LOCATION.INDICES] = new Uint16BufferElementAttribute(array, size, 'indices');
    this.hasIndices = true;

  }

  // attribute getters
  
  getPositions(): Float32Array {

    if (this.hasPositions) {

      const positions = this.attributes[ATTRIBUTE_LOCATION.POSITION].array;

      if (positions instanceof Float32Array) {

        return positions;

      }

    }
    // else return a empty array
    return new Float32Array();

  }

}
import { Program } from '../renderers/webgl/Program';
import { Geometry } from './Geometry';

class BufferAttribute {

  itemSize: number;
  type: string;
  array?: Float32Array | Uint16Array;
  buffer: WebGLBuffer | null;

  constructor( size: number, type: string ) {

    this.itemSize = size;
    this.buffer = null;
    this.type = type;

  }

  /**
   * Creates a gl.buffer and vertex attribute array by default
   */
  createBuffer( gl: WebGL2RenderingContext ): void {

    const buffer = gl.createBuffer();

    this.buffer = buffer;

  }

  /**
   * Initializes vertex attribute array to the program
   */
  bindBufferWithProgram( gl: WebGL2RenderingContext, geometry: Geometry, program: Program ): void {

    const vao = geometry.vao;

    if (!this.array || !vao) return;

    const array = this.array;
    const buffer = this.buffer;

    let location = 0;

    switch (this.type) {
      case 'normal':
        location = program.A_NORMAL;
        break;
      case 'position':
        location = program.A_POSITION;
        break;
    }

    // turn on the attribute
    gl.enableVertexAttribArray(location);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    // set data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        
    // How to get data from the position buffer
    const size = this.itemSize;
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);

  }
}

class Float32BufferAttribute extends BufferAttribute {

  array: Float32Array;
  
  constructor( array: Float32Array, size: number, type: string ) {
    super( size, type );

    this.array = array;

  }

}

/* Only used with indices == gl.ELEMENT_ARRAY_BUFFER */
class Uint16BufferElementAttribute extends BufferAttribute {

  array: Uint16Array;
  
  constructor( array: Uint16Array, size: number, type: string ) {
    super( size, type );

    this.array = array;

  }

  /**
   * Creates and sets the buffer
   */
  createBuffer( gl: WebGL2RenderingContext ): void {

    const buffer = gl.createBuffer();
    const array = this.array;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.buffer = buffer;

  }

  /**
   * gl.ELEMENT_ARRAY_BUFFER needs to be binded at every render,
   * No point in additional init binding
   */
  bindBufferWithProgram = (): void => { return; };
}

export {

  BufferAttribute,
  Float32BufferAttribute,
  Uint16BufferElementAttribute
  
};
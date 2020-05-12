import { UBO } from './UBO';
import { Geometry } from '../../geometries/Geometry';
import { ATTRIBUTE_LOCATION } from '../../geometries/Geometry';

export class Program {

  gl: WebGL2RenderingContext;
  WebGLProgram: WebGLProgram;
  uniforms: { [key: string]: { location: WebGLUniformLocation; type: string } }; 
  A_POSITION: number;
  A_NORMAL: number;
  targetMaterial: string;
  _bindedGeometryId: number;

  constructor( gl: WebGL2RenderingContext, shaderProgram: WebGLProgram, target: string ) {

    this.gl = gl;
    this.WebGLProgram = shaderProgram;

    this.uniforms = {};

    this.A_POSITION = -1;
    this.A_NORMAL = -1;

    this.targetMaterial = target;
    this._bindedGeometryId = -1;

  }

  /**
   * Binds the chosen geometry only if it is not binded yet.
   * Unbinds the previous vao and leaves current vao binded.
   */
  bindVAO( gl: WebGL2RenderingContext, geometry: Geometry ): void {

    if (geometry.id === this._bindedGeometryId) {
      return;
    }

    const attributes = geometry.attributes;
    const vao = geometry.vao;
    const indices = attributes[ATTRIBUTE_LOCATION.INDICES];

    if (!vao) { console.error('VALO.Mesh: renderItem() has no VerexArrayObject'); return; }

    //gl.bindVertexArray(null);
    gl.bindVertexArray(vao);

    if (indices.array) {

      //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);

    }

    this._bindedGeometryId = geometry.id;

  }

  /**
   * Unbinds element array buffer and vao
   */
  unBindVAO( gl: WebGL2RenderingContext ): void {

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
    this._bindedGeometryId = -1;

  }

  prepareUniforms( ...args: string[] ): void {

    if ( args.length % 2 !== 0 ) { console.error('Invalid lenght of arguments'); return; }

    const gl = this.gl;
    const program = this.WebGLProgram;

    let location: WebGLUniformLocation | null = 0;
    for ( let i = 0; i < args.length; i += 2 ) {

      location = gl.getUniformLocation( program, args[i] );
      if ( location !== null ) this.uniforms[args[i]] = {location: location, type: args[i+1]};

    }

  }

  prepareUniformBlocks( ...args: unknown[] ): void {

    if ( args.length % 2 !== 0 ) { console.error('Invalid lenght of arguments'); return; }

    const gl = this.gl;
    const program = this.WebGLProgram;

    for (let i = 0; i < args.length; i += 2) {

      const idx = args[i+1];
      const ubo = args[i];
      if (typeof idx == 'number' && ubo instanceof UBO) {
        gl.uniformBlockBinding(program, idx, ubo.blockPoint);
      }

    }

  }

  /**
   * 
   * @param args must be a pair (string, number[])
   */
  setUniforms( args: unknown[] ): this {

    if ( args.length % 2 !== 0 ) { console.error('Invalid lenght of arguments'); return this; }
  
    let name = '';
    let array: Array<number> | undefined;

    for (let i = 0; i < args.length; i += 2) {
      const nm = args[i], ary = args[i+1];

      if (typeof nm === 'string' && ary instanceof Array) {
        name = nm;
        array = ary;
      }
      
      if ( this.uniforms[name] === undefined || array === undefined ){ console.log('uniform not found ' + name); return this; }

      switch(this.uniforms[name].type){
        case 'vec2':		this.gl.uniform2fv(this.uniforms[name].location, new Float32Array()); break;
        case 'vec3':		this.gl.uniform3fv(this.uniforms[name].location, new Float32Array(array)); break;
        case 'vec4':		this.gl.uniform4fv(this.uniforms[name].location, new Float32Array(array)); break;
        case 'mat4':	this.gl.uniformMatrix4fv(this.uniforms[name].location, false, array); break;
        default: console.log('unknown uniform type for ' + name); break;
      }
    }

    return this;

  }

  preRender( ...args: unknown[] ): this {

    this.gl.useProgram(this.WebGLProgram); //Save a function call and just activate this shader program on preRender

		//If passing in arguments, then lets push that to setUniforms for handling. Make less line needed in the main program by having preRender handle Uniforms
    if (args.length > 0) this.setUniforms(args);
    
    return this;

  }

  setAttribLocations( gl: WebGL2RenderingContext, hasNormals: boolean ): void {

    const program = this.WebGLProgram;

    const position = gl.getAttribLocation(program, 'a_position');
    this.A_POSITION = position;

    if (hasNormals) {
      const normal = gl.getAttribLocation(program, 'a_normal');
      this.A_NORMAL = normal;
    }
    
  }

  destroy(): void {

    if( this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.WebGLProgram ) {
      this.gl.useProgram(null);
    }
    this.gl.deleteProgram(this.WebGLProgram);

    // delete also all uniforms and textures

  }

}

/**
 * Program class contains a program and all its uniform locations
 */
export default class Program {
  constructor(program) {
    this.WebGL_Program = program;

    // different uniform locations
    this.U_PIXELRATIO = null;
    this.U_RESOLUTION = null;
    this.U_ROTATION   = null;
    this.U_SCALE      = null;
    this.U_POSITION   = null;
    this.U_PARENT_POS = null;
    this.U_PARENT_ROT = null;
    this.U_COLOR      = null;
    this.U_TEXTURE    = null;
    this.U_TIME       = null;
  }

  setDefaultUniformLocations(gl, program) {
    this.U_PIXELRATIO = gl.getUniformLocation(program, 'u_pixelratio');
    this.U_RESOLUTION = gl.getUniformLocation(program, 'u_resolution');
  }

  setUniformLocationsBasic(gl, hasParent = false, texture = false, color = true) {
    const program = this.WebGL_Program;

    this.setDefaultUniformLocations(gl, program);
    
    this.U_ROTATION     = gl.getUniformLocation(program, 'u_rotation');
    this.U_SCALE        = gl.getUniformLocation(program, 'u_scale');
    this.U_POSITION     = gl.getUniformLocation(program, 'u_position');

    if (texture) {
      this.U_TEXTURE    = gl.getUniformLocation(program, 'u_texture');
    }
    
    if (color) {
      this.U_COLOR      = gl.getUniformLocation(program, 'u_color');
    }

    if (hasParent) {
      this.U_PARENT_POS = gl.getUniformLocation(program, 'u_parent_position');
      this.U_PARENT_ROT = gl.getUniformLocation(program, 'u_parent_rotation');
    }
  }

  setUniformLocationsPoints(gl) {
    const program = this.WebGL_Program;
    this.setDefaultUniformLocations(gl, program);

    this.U_SCALE = gl.getUniformLocation(program, 'u_scale');
  }

  setUniformLocationsLines(gl) {
    const program = this.WebGL_Program;
    this.setDefaultUniformLocations(gl, program);

    this.U_COLOR = gl.getUniformLocation(program, 'u_color');
  }

  setUniformLocationTime(gl) {
    this.U_TIME = gl.getUniformLocation(this.WebGL_Program, 'u_time');
  }
}
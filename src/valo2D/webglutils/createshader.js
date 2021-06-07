/**
   * Ensures that attributes are in certain positions
   * in the shader programs
   * 
   * Call in setup before linking!
   */
function setStandardAttributeLocations(gl, program) {
  gl.bindAttribLocation(program, 0, 'a_position');
  gl.bindAttribLocation(program, 1, 'a_color');
  gl.bindAttribLocation(program, 2, 'a_texcoord');
}

/**
   * Creates shader programs
   * @param {string} vertContent 
   * @param {string} fragContent 
   */
export function createShaderProgramFromScripts(gl, vertContent, fragContent) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertContent);
    
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragContent);

  // compile and check
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }
    
  // create program and attach shaders
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  setStandardAttributeLocations(gl, program);

  // link program
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
  }

  return program;
}

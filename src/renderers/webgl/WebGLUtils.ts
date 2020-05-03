const _clearColor = [1, 1, 1, 1];

export class WebGLUtils {

  static setupGL( gl: WebGL2RenderingContext, clearColor?: Array<number> ): void {

    const transparentBackground = false;
    
    const c = clearColor ? clearColor : _clearColor;

    // set the gl clear color and clear once to reset canvas
    const alpha = transparentBackground ? 0.0 : c[3];

    gl.clearColor(c[0], c[1], c[2], alpha);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // backfaces are not rendered
    gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.FRONT);

    // stacking up colors
    /*
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    */
  }

  static getRenderingContext(): string {
  
    if (window.WebGL2RenderingContext) {
      return 'webgl2';
    } else if (window.WebGLRenderingContext) {
      return 'webgl';
    } else {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      try {
        const gl = canvas.getContext('experimental-webgl');
        if (gl) {
          return 'experimental-webgl';
        }
      } catch (e) {
        console.log(e);
        window.alert('Your browser does not support WegGL!\nPlease use Chrome or Firefox if you want to see all the features.');
      }
    }
  
    return '';
  }

  static getWebGLObject( canvas: HTMLCanvasElement | null, options: WebGLContextAttributes ): WebGL2RenderingContext | WebGLRenderingContext | null {

    const glContext = WebGLUtils.getRenderingContext();
    if (glContext === '') return null;

    let gl;
    if (canvas) {
      gl = canvas.getContext(glContext, options);
    }

    // gl must be valid rendering context
    if (gl instanceof WebGL2RenderingContext || gl instanceof WebGLRenderingContext) {

      return gl;
    } else {

      return null;
    }
  }

  /**
  * Creates shader programs
  * @param {string} vertContent 
  * @param {string} fragContent 
  */
  static createShaderProgramFromScripts(gl: WebGLRenderingContext | WebGL2RenderingContext, vertContent: string, fragContent: string): WebGLProgram | null {

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return null;
    gl.shaderSource(vertexShader, vertContent);
      
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return null;
    gl.shaderSource(fragmentShader, fragContent);
  
    // compile and check
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
      return null;
    }
  
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
      return null;
    }
      
    // create program and attach shaders
    const program = gl.createProgram();
    if (!program) return null;
  
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
  
    // link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
  
    return program;
  }
}

/*
class WebGLContextAttributes {

  element = {};

  constructor(attributes: {
    alpha: boolean | undefined;
    desynchronized: boolean | undefined;
    antialias: boolean | undefined;
    depth: boolean | undefined;
    failIfMajorPerformanceCaveat: boolean | undefined;
    powerPreference: string;
    preMultipliedAlpha: boolean | undefined;
    preserveDrawingBuffer: boolean | undefined;
  }) {
    
    this.element = attributes;
  }
}
*/
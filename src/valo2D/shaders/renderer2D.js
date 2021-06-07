/**
 * returns vertex shader program in GLSL code.
 * @param {string} name name of the program
 */
export function getVertexShader(name) {
  switch (name) {
  case 'basic':
    return `
      precision mediump float;

      uniform float u_pixelratio;
      uniform vec2 u_resolution;

      attribute vec2 a_position;

      uniform float u_rotation;
      uniform vec2 u_scale;
      uniform vec2 u_position;

      void main() {
        vec2 pos = a_position * u_scale;

        float t = u_rotation;
        mat2 matrix = mat2(cos(t), -sin(t), sin(t), cos(t));

        // rotation and translation
        pos = (matrix * pos + u_position) / (u_resolution / u_pixelratio * 0.5);

        gl_Position = vec4(pos, 0.0, 1.0);
      }
      `;

  case 'child': 
    return `
      precision mediump float;

      uniform float u_pixelratio;
      uniform vec2 u_resolution;

      attribute vec2 a_position;

      uniform float u_rotation;
      uniform vec2 u_position;
      uniform vec2 u_scale;

      uniform float u_parent_rotation;
      uniform vec2 u_parent_position;

      void main() {
        vec2 pos0 = u_parent_position;
        float t0 = u_parent_rotation;

        vec2 pos = a_position * u_scale;
        float t = u_rotation;

        // first childs own rotaion and relation to the parent
        mat2 m = mat2(cos(t), -sin(t), sin(t), cos(t));
        pos = m * pos + u_position;

        // then parents rotations effect on the child
        mat2 m0 = mat2(cos(t0), -sin(t0), sin(t0), cos(t0));
        pos0 = (m0 * pos + pos0) / (u_resolution / u_pixelratio * 0.5);

        gl_Position = vec4(pos0, 0.0, 1.0);
      }
      `;

  case 'points':
    return `
    precision mediump float;

    // figure pixelratio later
    uniform float u_pixelratio;
    uniform vec2 u_resolution;
    uniform float u_scale;

    attribute vec2 a_position;
    attribute vec4 a_color;

    varying vec4 v_color;

    void main(void) {
      v_color = a_color;
      gl_Position = vec4((a_position / (u_resolution / u_pixelratio * 0.5)), 0.0, 1.0);
      gl_PointSize = u_scale;
    }
    `;

  case 'lines':
    return `
      precision mediump float;

      // figure pixelratio later
      uniform float u_pixelratio;
      uniform vec2 u_resolution;

      attribute vec2 a_position;

      void main(void) {
        gl_Position = vec4(a_position / (u_resolution / u_pixelratio * 0.5), 0.0, 1.0);
      }
      `;

  case 'vertexColor':
    return `
      precision mediump float;

      uniform float u_pixelratio;
      uniform vec2 u_resolution;

      attribute vec2 a_position;
      attribute vec4 a_color;

      varying vec4 v_color;

      uniform float u_rotation;
      uniform vec2 u_position;
      uniform vec2 u_scale;

      void main() {
        v_color = a_color;

        vec2 pos = a_position * u_scale;

        float t = u_rotation;
        mat2 matrix = mat2(cos(t), -sin(t), sin(t), cos(t));

        // rotation and translation
        pos = (matrix * pos + u_position) / (u_resolution / u_pixelratio * 0.5);

        gl_Position = vec4(pos, 0.0, 1.0);
      }
      `;

  case 'texture':
    return `
      precision mediump float;

      uniform float u_pixelratio;
      uniform vec2 u_resolution;

      attribute vec2 a_position;
      attribute vec2 a_texcoord;

      uniform float u_rotation;
      uniform vec2 u_position;
      uniform vec2 u_scale;

      varying highp vec2 v_texcoord;

      void main() {
        v_texcoord = a_texcoord;

        vec2 pos = a_position * u_scale;

        float t = u_rotation;
        mat2 matrix = mat2(cos(t), -sin(t), sin(t), cos(t));

        // rotation and translation
        pos = (matrix * pos + u_position) / (u_resolution / u_pixelratio * 0.5);

        gl_Position = vec4(pos, 0.0, 1.0);
      }
      `;
  }
}

/**
 * returns fragment shader program in GLSL code.
 * @param {string} name name of the program
 */
export function getFragmentShader(name) {
  switch (name) {
  case 'basic':
  case 'child':
  case 'lines':
    return `
      precision mediump float;

      uniform vec4 u_color;

      void main() {
        gl_FragColor = u_color;
      }
      `;
      
  case 'vertexColor':
  case 'points':
    return `
    precision mediump float;

      varying vec4 v_color;

      void main() {
        gl_FragColor = v_color;
      }
      `;

  case 'texture':
    return `
      varying highp vec2 v_texcoord;

      uniform sampler2D u_texture;

      void main(void) {
        gl_FragColor = texture2D(u_texture, v_texcoord);
      }
      `;
  }
}

import Vec2 from '../utils/math/vector2';

/**
 * A super class for all shapes
 */
export default class AbstractShape {
  constructor(scene) {
    this.scene = scene;

    this.position;
    // rad
    this.rotation = 0;

    this.scale = new Vec2(1, 1);
    this.scaleFactor = 1;

    this.color;

    // TODO: every shape should have a center of rotation so that the can be rotated outside their center
    this.centerOfRotation;

    this.vertexData;
    this.amountOfVertices = 0;

    // contains all the essential information about drawing the shape
    this.programInfo = {
      position: null,
      index: null, 
      uv: null,
      color: null,
      drawMode: 0,
      program: null,
      drawElements: false,
      hasTexture: false,
    };

    // if true, build geometry in each frame
    this.updatable = false;

    this.isClone = false;
    this.isVisible;
    this.isActive;

    this.hasParent = false;
    this.parent;
    this.children;
  }

  /**
   * Adds a child to the childrens list
   * Children follows the rotations of their parent
   * @param {AbstractShape} shape 
   */
  addChild(shape) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(shape);
    shape.hasParent = true;
    shape.parent = this;

    // switch the shader program
    shape.programInfo.program = this.scene.renderer.programs.child;

    // also try to add to the scene
    this.scene.addShape(shape);
  }

  /**
   * Deletes a child from childs list
   * @param {AbstractShape} shape 
   */
  deleteChild(shape) {
    const idx = this.children.indexOf(shape);
    if (idx === -1) return;

    this.children.splice(idx, 1);
  }

  /**
   * Builds program-info -object witch passes information about renderig to the renderer.
   * @param {VertexData} data 
   */
  buildProgramInfo(data, previousProgram = null) {
    if (process.env.NODE_ENV === 'test') { this.programInfo = {}; return; }

    const gl = this.scene.renderer.gl;
    const program = previousProgram || this.scene.renderer.programs.basic;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

    if (data.uvs) {
      this.bindUVBuffer(data.uvs, gl);
    }

    if (data.colors) {
      this.setVertexColors(data.colors);
    }

    this.programInfo.position = positionBuffer;
    this.programInfo.index = indicesBuffer;
    this.programInfo.drawMode = gl.TRIANGLES;
    this.programInfo.program = program;
    this.programInfo.drawElements = true;
  }

  /**
   * Returns a clone of this element. Clone uses it's own position. Saves memory.
   * @returns {AbstractShape} cloned shape
   */
  clone() {
    const shape = new AbstractShape(this.scene);
    shape.vertexData = this.vertexData;
    shape.programInfo = this.programInfo;
    shape.amountOfVertices = this.amountOfVertices;
    shape.color = this.color.clone();
    shape.position = new Vec2(0, 0);
    shape.isClone = true;
    return shape;
  }

  /**
   * Merges the given shape into this shape and destroys it.
   * Doesn't save the textures of given shape.
   * @param {AbstractShape} shape
   * @returns {AbstractShape} shape
   */
  merge(shape) {
    if (shape.programInfo.drawMode != this.programInfo.drawMode 
      || shape.programInfo.drawElements != this.programInfo.drawElements
      || (shape.vertexData.colors ? (this.vertexData.colors ? false : true) : (this.vertexData.colors ? true : false))
      || (shape.vertexData.uvs ? (this.vertexData.uvs ? false : true) : (this.vertexData.uvs ? true : false))) {
      console.error('Merge was unsuccesful because shapes are not compatible');
      return this;
    }

    // calculate given shapes relative position to this shape
    const pos = shape.position.addInPlace(-this.position.x, -this.position.y);
    const rot = shape.rotation;
    const scale = shape.scale;
    const positions = [...shape.vertexData.positions];
    const indices = shape.vertexData.indices.map(i => i + this.vertexData.positions.length / 2);

    // rotation
    for (let i = 0; i < positions.length; i += 2) {
      const x = positions[i] * scale.x * shape.scaleFactor;
      const y = positions[i+1] * scale.y * shape.scaleFactor;
      positions[i] = x * Math.cos(rot) - y * Math.sin(rot);
      positions[i+1] = x * Math.sin(rot) + y * Math.cos(rot);
    }

    // translation
    for (let i = 0; i < positions.length; i += 2) {
      positions[i] += pos.x;
      positions[i+1] += pos.y;
    }

    // add geometry to vertwx data
    this.vertexData.positions = this.vertexData.positions.concat(positions);
    this.vertexData.indices   = this.vertexData.indices.concat(indices);

    if (this.vertexData.colors) {
      this.vertexData.colors = this.vertexData.colors.concat(shape.vertexData.colors);
    }

    if (this.vertexData.uvs) {
      this.vertexData.uvs = this.vertexData.uvs.concat(shape.vertexData.uvs);
    }

    // save the new amount of vertices
    this.amountOfVertices = this.vertexData.indices.length;

    // new program buffers
    this.destroyProgramBuffers();
    this.buildProgramInfo(this.vertexData, this.programInfo.program);

    // destroys the given shape
    shape.destroy();

    return this;
  }

  /**
   * Adds texture and uv-data for the shape
   * @param {TEXTURE_2D} texture 
   */
  addTexture(texture) {
    const program = this.scene.renderer.programs.texture;

    this.buildUVBuffer();
    this.programInfo.hasTexture = true;
    this.programInfo.texture = texture;
    this.programInfo.program = program;
    this.scene.renderer.addProgramInUse(program);
  }

  /**
   * Sets shape with a new shaderprogram and optionally builds an uv buffer
   * @param {any} program 
   * @param {boolean} buildBuffer 
   */
  setShaderProgram(program, buildBuffer = false) {
    if (buildBuffer) {
      this.buildUVBuffer();
    }
    
    this.programInfo.program = program;
    this.scene.renderer.addProgramInUse(program);
  }

  /**
   * Creates a color buffer that colors all the vertices individually.
   * For all vertices in array there needs to be 4 values (r, g, b, a).
   * @param {Array} colors 
   */
  setVertexColors(colors) {
    if (colors.length !== this.vertexData.positions.length * 2) { console.error('Color array has an invalid length'); return; }
    const gl = this.scene.renderer.gl;
    const program = this.scene.renderer.programs.vertexColor;
    this.vertexData.colors = colors;

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    this.programInfo.color = colorBuffer;
    this.programInfo.program = program;
    this.scene.renderer.addProgramInUse(program);
  }

  /**
   * Binds uv-buffer array to the webgl instance.
   * Adds uv buffer in to the program-info-object.
   * @param {Array} uvs 
   * @param {WebGL2RenderingContext} gl 
   */
  bindUVBuffer(uvs, gl) {
    if (!this.programInfo) { console.error('No programInfo-object'); return; }

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    this.programInfo.uv = uvBuffer;
  }

  /**
   * Destroys the data related to the shape and deletes from scene
   */
  destroy(deleteBuffers = true) {
    this.scene.deleteShape(this);

    if (this.hasParent) {
      this.parent.deleteChild(this);
    }
    
    if (this.children) {
      this.children.forEach(child => child.destroy());
    }
    
    if (!this.isClone) {
      this.vertexData.destroy();
    }

    if (deleteBuffers) {
      this.destroyProgramBuffers();
    }

    this.programInfo = null;
    this.vertexData = null;
    this.color.buffer = null;
    this.color = null;
  }

  /**
   * Destroys all the buffers saved in program info object
   */
  destroyProgramBuffers() {
    if (this.isClone) { return; }

    const gl = this.scene.renderer.gl;
    const position = this.programInfo.position;
    const index = this.programInfo.index;
    const uv = this.programInfo.uv;
    const color = this.programInfo.color;

    if (position) {
      gl.deleteBuffer(position);
    }
  
    if (index) {
      gl.deleteBuffer(index);
    }
  
    if (uv) {
      gl.deleteBuffer(uv); 
    }

    if (color) {
      gl.deleteBuffer(color);
    }
  }
}
import AbstractShape from './abstractshape';
import VertexData from './geometry/vertexdata';
import Color from '../utils/color';
import Vec2 from '../utils/math/vector2';

export default class Circle extends AbstractShape {
  constructor(scene, options) {
    super(scene);

    // options object
    this.options = options || {};

    // different options 
    this.radius = this.options.radius || 50;
    this.arc = this.options.arc || 1.0;
    this.tessellation = this.options.tessellation || 64;
    this.color = this.options.color || new Color(0.0, 0.5, 0.5);

    // variables you need to change
    this.position = new Vec2(0, 0);
    this.rotation = 0;

    this.init();
  }

  /**
   * Initial function
   */
  init() {
    const data = this.buildGeometry();
    this.buildProgramInfo(data);
  }

  /**
   * Builds the circle geometry. Gets called only once.
   */
  buildGeometry() {
    const arc = this.arc;
    const tessellation = this.tessellation;
    const radius = this.radius;

    const positions = [];
    const indices = [];

    // disc center first
    positions.push(0, 0);
    
    const theta = Math.PI * 2 * arc;
    const step = theta / tessellation;
    
    // circle closes only if we go half step over in the for loop
    for (let a = 0; a < theta + step/2; a += step) {
      const x = radius * Math.cos(a);
      const y = radius * Math.sin(a);
      positions.push(x, y);
    }

    //indices
    const vertexNb = positions.length / 2;
    for (let i = 1; i < vertexNb - 1; i++) {
      indices.push(i + 1, 0, i);
    }

    const vertexData = new VertexData(positions, indices);
    this.vertexData = vertexData;

    // save the number of vertices shape would have on screen
    this.amountOfVertices = indices.length;

    return vertexData;
  }

  /**
   *  Adds to vertexData information about texture coordinates in circle to VertexData-object.
   *  Necessary only if there is a texture or personal shader.
   */
  buildUVBuffer() {
    const gl = this.scene.renderer.gl;

    const arc = this.arc;
    const tessellation = this.tessellation;

    const uvs = [];
    uvs.push(0.5, 0.5);

    const theta = Math.PI * 2 * arc;
    const step = theta / tessellation;
    for (let a = 0; a < theta + step/2; a += step) {
      const x = Math.cos(a);
      const y = Math.sin(a);
      const u = (x + 1) / 2;
      const v = (1 - y) / 2;
      uvs.push(u, v);
    }

    this.vertexData.uvs = uvs;
    // bind the buffer
    this.bindUVBuffer(uvs, gl);
  }
}
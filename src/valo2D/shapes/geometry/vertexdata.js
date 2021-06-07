export default class VertexData {
  constructor(positions, indices, uvs = null, colors = null) {
    this.positions = positions;
    this.indices = indices;
    this.uvs = uvs;
    this.colors = colors;
  }

  /**
   * Destroys the vertex data
   */
  destroy() {
    this.positions = null;
    this.indices = null;
    this.uvs = null;
    this.colors = null;
  }
}
export default class Scene {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.shapes = [];

    this.textures = [];

    this.amountOfVertices = 0;
  }

  /**
   * Adds a shape in to the scene
   * @param {AbstractShape} shape 
   */
  addShape(shape) {
    if (!this.shapes.includes(shape)) {
      this.shapes.push(shape);
      this.renderer.addProgramInUse(shape.programInfo.program);
      this.amountOfVertices += shape.amountOfVertices;
    }
  }

  /**
   * Deletes a shape from the scene
   * @param {AbstractShape} shape 
   */
  deleteShape(shape) {
    const idx = this.shapes.indexOf(shape);

    if (idx !== -1) {
      this.shapes.splice(idx, 1);
      this.renderer.deleteProgramFromUse(shape.programInfo.program);
      this.amountOfVertices -= shape.amountOfVertices;
    }
  }

  /**
   * probably wont change
   * try to half the buffer
   */
  getVertexColorData() {
    const colors = this.vertexColorData;

    let lastIndex = 0;
    this.shapes.forEach(shape => {
      const colorData = shape.color.buffer;

      for (let i = 0; i < colorData.length; i += 1) {
        colors[lastIndex+i] = colorData[i];
      }

      lastIndex += colorData.length;
    });

    return colors;
  }

  /**
   * Renders the scene once
   */
  render() {
    this.renderer.render();
  }

  /**
   * Destroys the scene with all of it's shapes
   */
  destroy() {
    this.shapes.forEach(shape => shape.destroy());
    this.textures.forEach(tex => this.renderer.gl.deleteTexture(tex.texture));
    this.shapes = null;
  }
}
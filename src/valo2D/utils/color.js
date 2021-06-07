/**
 * Color class
 */
export default class Color {
  /**
   * Set values for color
   * @param {number} r Red
   * @param {number} g Green
   * @param {number} b Blue
   * @param {number} a Alpha (optional)
   */
  constructor(r, g, b, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this._arr;
  }

  /**
   * Set new values for color
   * @param {number} r Red
   * @param {number} g Green
   * @param {number} b Blue
   * @param {number} a Alpha
   */
  set(r, g, b, a = 1.0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  /**
   * @returns {Array} the color as an array
   */
  getAsArray() {
    if (!this._arr) this._arr = [this.r, this.g, this.b, this.a];
    else {
      this._arr[0] = this.r;
      this._arr[1] = this.g;
      this._arr[2] = this.b;
      this._arr[3] = this.a;
    }
    return this._arr;
  }

  /**
   * returns a new color with same values
   */
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
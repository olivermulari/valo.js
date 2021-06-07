export default class Matrix3 {
  /**
   * xx yx zx
   * xy yy zy
   * xz yz zz
   */
  constructor() {
    this.xx = 0;
    this.yx = 0;
    this.zx = 0;

    this.xy = 0;
    this.yy = 0;
    this.zy = 0;

    this.zx = 0;
    this.zy = 0;
    this.zz = 0;
  }

  /**
   * Sets up the matrix
   * @returns {Matrix3} this
   */
  set(xx, yx, zx, xy, yy, zy, xz, yz, zz) {
    this.xx = xx;
    this.yx = yx;
    this.zx = zx;

    this.xy = xy;
    this.yy = yy;
    this.zy = zy;

    this.zx = xz;
    this.zy = yz;
    this.zz = zz;

    return this;
  }

  /**
   * sets this to be identity matrix
   * @returns {Matrix3} this
   */
  identity() {
    this.xx = 1;
    this.yx = 0;
    this.zx = 0;

    this.xy = 0;
    this.yy = 1;
    this.zy = 0;

    this.zx = 0;
    this.zy = 0;
    this.zz = 1;
    
    return this;
  }

  /**
   * Matrix multiplication. Result is stored in this matrix
   * @param {Matrix3} m 
   * @returns {Matrix3} this
   */
  mult(m) {
    const xx = this.xx * m.xx + this.yx * m.xy + this.zx * m.xz;
    const yx = this.xx * m.yx + this.yx * m.yy + this.zx * m.yz;
    const zx = this.xx * m.zx + this.yx * m.zy + this.zx * m.zz;

    const xy = this.xy * m.xx + this.yy * m.xy + this.zy * m.xz;
    const yy = this.xy * m.yx + this.yy * m.yy + this.zy * m.yz;
    const zy = this.xy * m.zx + this.yy * m.zy + this.zy * m.zz;

    const xz = this.xz * m.xx + this.yz * m.xy + this.zz * m.xz;
    const yz = this.xz * m.yx + this.yz * m.yy + this.zz * m.yz;
    const zz = this.xz * m.zx + this.yz * m.zy + this.zz * m.zz;

    this.set(xx, yx, zx, xy, yy, zy, xz, yz, zz);
    return this;
  }

  /**
   * clones this matrix and returns new matrix
   * @returns {Matrix3} new matrix
   */
  clone() {
    const clone = new Matrix3();
    clone.set(
      this.xx, this.yx, this.zx,
      this.xy, this.yy, this.zy,
      this.xz, this.yz, this.zz
    );
    return clone;
  }
}
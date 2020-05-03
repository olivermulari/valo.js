export class Matrix3 {

  elements: Array<number>;

  constructor() {

    this.elements = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1.
    ];

  }

  set(xx: number, yx: number, zx: number, xy: number, yy: number, zy: number, xz: number, yz: number, zz: number): this {

    const e = this.elements;

    e[0] = xx; e[1] = yx; e[2] = zx;
    e[3] = xy; e[4] = yy; e[5] = zy;
    e[6] = xz; e[7] = yz; e[8] = zz;

    return this;
    
  }

  identity(): this {

    this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
    
    return this;
  }

  multiply( m: Matrix3, t: Matrix3 ): this {

    const me = m.elements;
    const te = t.elements;

    const e = this.elements;

    e[0] = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
    e[1] = me[0] * te[1] + me[1] * te[4] + me[2] * te[7];
    e[2] = me[0] * te[2] + me[1] * te[5] + me[2] * te[8];

    e[3] = me[3] * te[0] + me[4] * te[3] + me[5] * te[6];
    e[4] = me[3] * te[1] + me[4] * te[4] + me[5] * te[7];
    e[5] = me[3] * te[2] + me[4] * te[5] + me[5] * te[8];

    e[6] = me[6] * te[0] + me[7] * te[3] + me[8] * te[6];
    e[7] = me[6] * te[1] + me[7] * te[4] + me[8] * te[7];
    e[8] = me[6] * te[2] + me[7] * te[5] + me[8] * te[8];

    return this;

  }

  copy( m: Matrix3 ): this {

    const e = m.elements;

    this.set(
      e[0], e[1], e[2],
      e[3], e[4], e[5],
      e[6], e[7], e[8],
    );

    return this;

  }

  clone(): Matrix3 {

    return new Matrix3().copy( this );

  }

}
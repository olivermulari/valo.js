/* eslint-disable no-undef */
import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';

// eslint-disable-next-line prefer-const
let m4: Matrix4;

// some buffer vectors for calculations
const v0 = new Vector3();
const v1 = new Vector3();
const v2 = new Vector3();

// for rotation quaternion
const _zero = new Vector3( 0, 0, 0 );
const _one = new Vector3( 1, 1, 1 );

export class Matrix4 {

  elements: Array<number>;

  constructor() {

    this.elements = [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1,
    ];

  }

  set( n11: number, n12: number, n13: number, n14: number, 
       n21: number, n22: number, n23: number, n24: number, 
       n31: number, n32: number, n33: number, n34: number, 
       n41: number, n42: number, n43: number, n44: number ): this {
    
    const te = this.elements;
    
    te[0] = n11; te[1] = n12; te[2] = n13; te[3] = n14;
    te[4] = n21; te[5] = n22; te[6] = n23; te[7] = n24;
    te[8] = n31; te[9] = n32; te[10] = n33; te[11] = n34;
    te[12] = n41; te[13] = n42; te[14] = n43; te[15] = n44;

    return this;

  }

  identity(): this {

    this.set(
      1,  0,  0,  0, 
      0,  1,  0,  0, 
      0,  0,  1,  0, 
      0,  0,  0,  1,
    );

    return this;

  }

  transponse( m: Matrix4 ): this {

    const me = m.elements;

    this.set(
      me[0], me[4], me[8], me[12],
      me[1], me[5], me[9], me[13],
      me[2], me[6], me[10], me[14],
      me[3], me[7], me[11], me[15],
    );

    return this;

  }

  multiply( a: Matrix4, b: Matrix4 ): this {

		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;

		const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
		const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
		const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
		const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

		const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
		const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
		const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
		const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
    
  }
  
  translate( tx: number, ty: number, tz: number ): this {

    m4.set(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1,
    );

    return this.multiply(this, m4);

  }

  xRotate( theta: number ): this {

    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m4.set(
      1,  0,  0,  0,
      0,  c,  s,  0,
      0, -s,  c,  0,
      0,  0,  0,  1,
    );

    return this.multiply(this, m4);

  }

  yRotate( theta: number ): this {

    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m4.set(
      c,  0, -s,  0,
      0,  1,  0,  0,
      s,  0,  c,  0,
      0,  0,  0,  1,
    );

    return this.multiply(this, m4);

  }

  zRotate( theta: number ): this {

    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m4.set(
       c,  s,  0,  0,
      -s,  c,  0,  0,
       0,  0,  1,  0,
       0,  0,  0,  1,
    );

    return this.multiply(this, m4);

  }

  scale( x: number, y: number, z: number ): this {

    m4.set(
      x,  0,  0,  0,
      0,  y,  0,  0,
      0,  0,  z,  0,
      0,  0,  0,  1,
    );

    return this.multiply(this, m4);

  }

  inverse( m: Matrix4 ): this {
    
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const te = this.elements,
    me = m.elements,

    n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
    n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
    n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
    n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

    t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
    t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
    t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
    t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if ( det === 0 ) {

      const msg = 'Matrix4: .inverse() can\'t invert matrix, determinant is 0';
      console.log(msg);

      return this.identity();

    }

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
    te[2] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
    te[3] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

    te[4] = t12 * detInv;
    te[5] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
    te[6] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
    te[7] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

    te[8] = t13 * detInv;
    te[9] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
    te[10] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
    te[11] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

    te[12] = t14 * detInv;
    te[13] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
    te[14] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
    te[15] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

    return this;

  }

  compose( position: Vector3, quaternion: Quaternion, scale: Vector3 ): this {

		const te = this.elements;

		const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale.x, sy = scale.y, sz = scale.z;

		te[0] = ( 1 - ( yy + zz ) ) * sx;
		te[1] = ( xy + wz ) * sx;
		te[2] = ( xz - wy ) * sx;
		te[3] = 0;

		te[4] = ( xy - wz ) * sy;
		te[5] = ( 1 - ( xx + zz ) ) * sy;
		te[6] = ( yz + wx ) * sy;
		te[7] = 0;

		te[8] = ( xz + wy ) * sz;
		te[9] = ( yz - wx ) * sz;
		te[10] = ( 1 - ( xx + yy ) ) * sz;
		te[11] = 0;

		te[12] = position.x;
		te[13] = position.y;
		te[14] = position.z;
		te[15] = 1;

		return this;

  }
  
  setFromQuaternion( q: Quaternion ): this {

    return this.compose( _zero, q, _one );

  }

  /**
   * Returns a projection matrix that can become a viewMatrix by taking its inverss
   * This is NOT a world matrix
   */
  lookAt( position: Vector3, target: Vector3, up: Vector3 ): this {

    const p = v0.copy(position);
    const u = v1.copy(up);
    
    const z = p.subtract(target).normalize();
    const x = u.cross(z).normalize();
    const y = v2.copy(z).cross(x).normalize();

    this.set(
      x.x, x.y, x.z, 0,
      y.x, y.y, y.z, 0,
      z.x, z.y, z.z, 0,
      position.x,
      position.y,
      position.z,
      1
    );

    return this;

  }

  /**
   * Perspective matrix 
   * 
   * @param fov must 1 - 180
   * @param aspect must be positive
   * @param near must be positive
   * @param far must be positive
   */
  setPerspective( fov: number, aspect: number, near: number, far: number ): this {

    const fieldOfViewInRadians = fov * Math.PI / 180;
    const f = Math.tan( Math.PI * 0.5 - 0.5 * fieldOfViewInRadians );
    const rangeInv = 1.0 / (near - far);
    
    return this.set(
      f / aspect, 0, 0, 0,
      0, f , 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, 2 * near * far * rangeInv, 0,
    );

  }

  /**
   * Ortographic matrix
   */
  setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this {

    return this.set(
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
 
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    );

  }

  /**
   * Copies elements from the Matrix4 m to this Matrix4
   * @param m Matrix4
   */
  copy( m: Matrix4 ): this {

    const te = this.elements;
    const me = m.elements;

    te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
    te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
    te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
    te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

    return this;
  }

  clone(): Matrix4 {

    return new Matrix4().copy( this );

  }

}

m4 = new Matrix4();

import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';

const _q = new Quaternion();

export class Vector3 {

  x: number;
  y: number;
  z: number;

  constructor( x?: number, y?: number, z?: number ) {
    
    this.x = ( x !== undefined ) ? x : 0;
    this.y = ( y !== undefined ) ? y : 0;
    this.z = ( z !== undefined ) ? z : 0;

  }

  set( x: number, y: number, z: number ): this {

    this.x = x;
    this.y = y;
    this.z = z;

    return this;

  }

  add( v: Vector3 ): this {

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;

  }

  subtract( v: Vector3 ): this {

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
    
  }

  divide( n: number ): this {

    if (n === 0) {
      const msg = 'Vector3: divide(), Can\'t divide with a zero.';
      console.warn(msg);
    }

    this.x /= n;
    this.y /= n;
    this.z /= n;

    return this;

  }

  inverse( v: Vector3 ): this {

    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;

    return this;

  }

  min( v: Vector3 ): this {

    this.x = Math.min( this.x, v.x );
    this.y = Math.min( this.y, v.y );
    this.z = Math.min( this.z, v.z );

    return this;

  }

  max( v: Vector3 ): this {

    this.x = Math.max( this.x, v.x );
    this.y = Math.max( this.y, v.y );
    this.z = Math.max( this.z, v.z );

    return this;

  }

  multiply( n: number ): this {

    this.x *= n;
    this.y *= n;
    this.z *= n;

    return this;
    
  }

  magSq(): number {

    const x = this.x; const y = this.y; const z = this.z;

    return x * x + y * y + z * z;

  }

  mag(): number {

    return Math.sqrt( this.magSq() );

  }

  normalize(): this {

    return this.divide( this.mag() );

  }

  dot( v: Vector3 ): number {

    return this.x * v.x + this.y * v.y + this.z * v.z;

  }

  cross( v: Vector3, target?: Vector3 ): Vector3 {

    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;

    if (target !== undefined) {
      return target.set(x, y, z);
    }
    
    return this.set(x, y, z);

  }

  applyQuaternion( q: Quaternion ): this {

		const x = this.x, y = this.y, z = this.z;
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

  }
  
  applyAxisAngle( axis: Vector3, angle: number ): this {

		return this.applyQuaternion( _q.setFromAxisAngle( axis, angle ) );

	}

  applyMatrix4( m: Matrix4 ): this {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;
    
    const w = 1 / ( e[3] * x + e[7] * y + e[11] * z + e[15] );

		this.x = ( e[0] * x + e[4] * y + e[8] * z + e[12] ) * w;
		this.y = ( e[1] * x + e[5] * y + e[9] * z + e[13] ) * w;
		this.z = ( e[2] * x + e[6] * y + e[10] * z + e[14] ) * w;

		return this;

  }
  
  equals( v: Vector3, error?: number ): boolean {

    const e = ( error !== undefined ) ? error : 0;

    return ( Math.abs( this.x - v.x ) < e && Math.abs( this.y - v.y ) < e && Math.abs( this.z - v.z ) < e );

  }

  copy( v: Vector3 ): this {

    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;

  }

  clone(): Vector3 {

    return new Vector3().copy( this );

  }
  
}

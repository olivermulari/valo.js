import { Quaternion } from './Quaternion';
import { Matrix4 } from './Matrix4';
import { MathUtils } from './MathUtils';


const _m4 = new Matrix4();

export class Euler {

  x: number;
  y: number;
  z: number;
  order: string;

  constructor( x?: number, y?: number, z?: number ) {

    /**
     * When facing towards -z and up vector is y
     * 
     * rotation around y axis equals yaw
     * rotation around x asis equals pitch
     * rotation around z axis equals roll
     */
    this.x = ( x !== undefined ) ? x : 0;
    this.y = ( y !== undefined ) ? y : 0;
    this.z = ( z !== undefined ) ? z : 0;

    this.order = 'YXZ';

  }

  setFromRotationMatrix( m: Matrix4 ): this {

		const te = m.elements;
		const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

    const order = this.order;

		if ( order === 'XYZ' ) {

			this.y = Math.asin( MathUtils.clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.9999999 ) {

				this.x = Math.atan2( - m23, m33 );
				this.z = Math.atan2( - m12, m11 );

			} else {

				this.x = Math.atan2( m32, m22 );
				this.z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this.x = Math.asin( - MathUtils.clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.9999999 ) {

				this.y = Math.atan2( m13, m33 );
				this.z = Math.atan2( m21, m22 );

			} else {

				this.y = Math.atan2( - m31, m11 );
				this.z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this.x = Math.asin( MathUtils.clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.9999999 ) {

				this.y = Math.atan2( - m31, m33 );
				this.z = Math.atan2( - m12, m22 );

			} else {

				this.y = 0;
				this.z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this.y = Math.asin( - MathUtils.clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.9999999 ) {

				this.x = Math.atan2( m32, m33 );
				this.z = Math.atan2( m21, m11 );

			} else {

				this.x = 0;
				this.z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this.z = Math.asin( MathUtils.clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.9999999 ) {

				this.x = Math.atan2( - m23, m22 );
				this.y = Math.atan2( - m31, m11 );

			} else {

				this.x = 0;
				this.y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this.z = Math.asin( - MathUtils.clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.9999999 ) {

				this.x = Math.atan2( m32, m22 );
				this.y = Math.atan2( m13, m11 );

			} else {

				this.x = Math.atan2( - m23, m33 );
				this.y = 0;

			}

    }
    
		return this;
  }

  setFromQuaternion( q: Quaternion ): this {
  
    _m4.setFromQuaternion( q );
  
    return this.setFromRotationMatrix( _m4 );

  }

  toQuaternion( q: Quaternion ): Quaternion {

    const x = this.x, y = this.y, z = this.z;

    const order = this.order;

		const cx = Math.cos( x / 2 );
		const cy = Math.cos( y / 2 );
		const cz = Math.cos( z / 2 );

		const sx = Math.sin( x / 2 );
		const sy = Math.sin( y / 2 );
		const sz = Math.sin( z / 2 );

		if ( order === 'XYZ' ) {

			q.x = sx * cy * cz + cx * sy * sz;
			q.y = cx * sy * cz - sx * cy * sz;
			q.z = cx * cy * sz + sx * sy * cz;
			q.w = cx * cy * cz - sx * sy * sz;

		} else if ( order === 'YXZ' ) {

			q.x = sx * cy * cz + cx * sy * sz;
			q.y = cx * sy * cz - sx * cy * sz;
			q.z = cx * cy * sz - sx * sy * cz;
			q.w = cx * cy * cz + sx * sy * sz;

		} else if ( order === 'ZXY' ) {

			q.x = sx * cy * cz - cx * sy * sz;
			q.y = cx * sy * cz + sx * cy * sz;
			q.z = cx * cy * sz + sx * sy * cz;
			q.w = cx * cy * cz - sx * sy * sz;

		} else if ( order === 'ZYX' ) {

			q.x = sx * cy * cz - cx * sy * sz;
			q.y = cx * sy * cz + sx * cy * sz;
			q.z = cx * cy * sz - sx * sy * cz;
			q.w = cx * cy * cz + sx * sy * sz;

		} else if ( order === 'YZX' ) {

			q.x = sx * cy * cz + cx * sy * sz;
			q.y = cx * sy * cz + sx * cy * sz;
			q.z = cx * cy * sz - sx * sy * cz;
			q.w = cx * cy * cz - sx * sy * sz;

		} else if ( order === 'XZY' ) {

			q.x = sx * cy * cz - cx * sy * sz;
			q.y = cx * sy * cz - sx * cy * sz;
			q.z = cx * cy * sz + sx * sy * cz;
			q.w = cx * cy * cz + sx * sy * sz;

		}

		return q;

  }

  equals( v: Euler, error?: number ): boolean {

    const e = ( error !== undefined ) ? error : 0;

    return ( Math.abs( this.x - v.x ) < e && Math.abs( this.y - v.y ) < e && Math.abs( this.z - v.z ) < e );

  }


}
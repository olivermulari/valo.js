import { Vector3 } from './Vector3';
import { Euler } from './Euler';
import { MathUtils } from './MathUtils';

export class Quaternion {

  x: number;
  y: number;
  z: number;
  w: number;

  constructor( x?: number, y?: number, z?: number, w?: number ) {

    // must be normalized so that

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;

  }

  conjugate( q: Quaternion ): this {

		this.x *= -q.x;
		this.y *= -q.y;
		this.z *= -q.z;

		return this;

	}

  dot( q: Quaternion ): number {

		return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;

	}

  length(): number {

    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w + this.w );

  }

  normalize(): this {

		let l = this.length();

		if ( l === 0 ) {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		} else {

			l = 1 / l;

			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;

		}

		return this;

	}

  setFromAxisAngle( axis: Vector3, angle: number ): this {

    axis.normalize();

    const halfAngle = angle / 2;
    const s = Math.sin( halfAngle );

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos( halfAngle );

		return this;

	}
	
	setFromEuler( e: Euler ): this {

		e.toQuaternion( this );

		return this;

	}

  angleTo( q: Quaternion ): number {

		return 2 * Math.acos( Math.abs( MathUtils.clamp( this.dot( q ), -1, 1 ) ) );

  }

  multiply( a: Quaternion, b: Quaternion ): this {

		const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	}
  
  slerp( q: Quaternion, t: number ): this {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( q );

		const x = this.x, y = this.y, z = this.z, w = this.w;

		let cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

		if ( cosHalfTheta < 0 ) {

			this.x = - q.x;
			this.y = - q.y;
      this.z = - q.z;
      this.w = - q.w;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( q );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if ( sqrSinHalfTheta <= Number.EPSILON ) {

			const s = 1 - t;
			this.w = s * w + t * this.w;
			this.x = s * x + t * this.x;
			this.y = s * y + t * this.y;
			this.z = s * z + t * this.z;

			this.normalize();

			return this;

		}

		const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
    const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
    
		const a = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta;
		const b = Math.sin( t * halfTheta ) / sinHalfTheta;

		this.w = ( w * a + this.w * b );
		this.x = ( x * a + this.x * b );
		this.y = ( y * a + this.y * b );
		this.z = ( z * a + this.z * b );

		return this;

	}

  rotateTowards( q: Quaternion, step: number ): this {

		const angle = this.angleTo( q );

		if ( angle === 0 ) return this;

		const t = Math.min( 1, step / angle );

		this.slerp( q, t );

		return this;

	}
	
	equals( q: Quaternion, error?: number ): boolean {

		let e = ( error !== undefined ) ? error : 0;
		if ( e < 0 ) { e *= -1; }

		return ( Math.abs(this.x - q.x) < e ) && ( Math.abs(this.y - q.y) < e ) && ( Math.abs(this.z - q.z) < e ) && ( Math.abs(this.w - q.w) < e );

	}
  
  copy( q: Quaternion ): this {

    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.z;

    return this;

  }

  clone(): Quaternion {

    return new Quaternion().copy( this );

  }

}
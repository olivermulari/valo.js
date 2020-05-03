import { Vector3 } from './Vector3';
import { Box } from './Box';

export class Plane {

  normal: Vector3;
  constant: number;

  constructor( normal?: Vector3, constant?: number ) {

    /**
     * According to planes equation Ax + By + Cx + W = 0
     * Where (A, B, C) is the normal vector and W is the constant
     * 
     * A point in a plane -> this.normal.multipy( this.constant )
     * 
     * Plane is assumed to be normaized at all times
     */

    this.normal = normal ? normal : new Vector3( 1, 0, 0 );
    this.constant = constant ? constant : 0;

  }

  set( normal: Vector3, constant: number ): this {

    this.normal.copy(normal);
    this.constant = constant;

    return this;

  }

  setComponents( x: number, y: number, z: number, w: number ): this {

		this.normal.set(x, y, z);
		this.constant = w;

    return this;
    
  }
  
  normalize(): this {

    const inverseLength = 1.0 / this.normal.mag();
    this.normal.multiply(inverseLength);
    this.constant *= inverseLength;

    return this;

  }

  negate(): this {

    this.normal.multiply(-1);
    this.constant *= -1;

    return this;

  }

  /**
   * Notice: if the point is in the opposite direction than the plane normal distance is negative.
   * 
   */
  distanceToPoint( point: Vector3 ): number {

    return this.normal.dot(point) + this.constant;

  }

  intersectsBox( box: Box ): boolean {

    return box.intersectsPlane(this);

  }

  copy( plane: Plane ): this {

    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;

  }

  clone(): Plane {

    return new Plane( this.normal.clone(), this.constant );

  }

}
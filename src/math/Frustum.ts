import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { Plane } from './Plane';
import { Box } from './Box';
import { Object3D } from '../objects/Object3D';
import { Mesh } from '../objects/Mesh';

const _box = new Box();
const _vector = new Vector3();

export class Frustum {

  planes: Array<Plane>;

  constructor( p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane ) {

    this.planes = [
      ( p0 !== undefined ) ? p0 : new Plane(),
      ( p1 !== undefined ) ? p1 : new Plane(),
      ( p2 !== undefined ) ? p2 : new Plane(),
      ( p3 !== undefined ) ? p3 : new Plane(),
      ( p4 !== undefined ) ? p4 : new Plane(),
      ( p5 !== undefined ) ? p5 : new Plane(),
    ];

  }

  set( p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane ): this {

    const p = this.planes;

    p[0].copy( p0 );
    p[1].copy( p1 );
    p[2].copy( p2 );
    p[3].copy( p3 );
    p[4].copy( p4 );
    p[5].copy( p5 );

    return this;

  }

  /**
   * Projection matrix is perspective matrix * inverse camera world matrix
   */
  setFromProjectionMatrix( m: Matrix4 ): this {

		const planes = this.planes;
		const me = m.elements;
		const me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		const me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		const me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		const me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

  }

  /**
   * The point is inside the frustum when all plane distances are positive since
   * all plane normals are faceng invards
   */
  containsPoint( point: Vector3 ): boolean {

    const planes = this.planes;

    for (let i = 0; i < 6; i++) {

      if (planes[i].distanceToPoint(point) < 0) {

        return false;

      }

    }

    return true;

  }
  
  /** TODO: Validate */
  intersectsBox( box: Box ): boolean {

    const planes = this.planes;

		for (let i = 0; i < 6; i++) {

      const plane = planes[i];

      // the corner with the maximum distance

			_vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
			_vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
      _vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

			if ( plane.distanceToPoint( _vector ) < 0 ) {

				return false;

			}

		}

    return true;

    /*

		const planes = this.planes;

		for (let i = 0; i < 6; i++) {

      const plane = planes[i];

      // the corner with the maximum distance

			_vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
			_vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
      _vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

			if ( plane.distanceToPoint( _vector ) < 0 ) {

				return false;

			}

		}

    return true;

    */

  }
  
  intersectsObject( object: Object3D ): boolean {
  
    if ( object instanceof Mesh ) {

      const worldMatrix = object.worldMatrix;

      _box.copy( object.boundingBox.box ).applyMatrix4( worldMatrix );

      return this.intersectsBox( _box );

    } else {

      return this.containsPoint( object.position );

    }
  
  }

  copy( frustum: Frustum ): this {

    const p = frustum.planes;
    this.set( p[0], p[1], p[2], p[3], p[4], p[5] );

    return this;

  }

  clone(): Frustum {

    return new Frustum().copy( this );

  }

}
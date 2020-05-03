import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { Plane } from './Plane';

const v0 = new Vector3();

const _points = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
];

export class Box {

  min: Vector3;
  max: Vector3;

  constructor( min?: Vector3, max?: Vector3 ) {

    this.min = ( min !== undefined ) ? min : new Vector3();
    this.max = ( max !== undefined ) ? max : new Vector3();

  }

  set( min: Vector3, max: Vector3 ): this {
    
    this.min.copy(min);
    this.max.copy(max);

    return this;

	}

	expandByPoint( point: Vector3 ): this {

		this.min.min( point );
		this.max.max( point );

		return this;

	}
	
	setFromPoints( points: Array<Vector3> ): this {

		points.forEach( point => {

			this.expandByPoint( point );

		});

		return this;

	}

	setFromPositions( positions: Array<number> | Float32Array ): this {

		for (let i = 0; i < positions.length; i += 3) {

			const x = positions[i];
			const y = positions[i+1];
			const z = positions[i+2];

			v0.set( x, y, z );

			this.expandByPoint( v0 );

		}

		return this;

	}

  intersectsPlane( plane: Plane ): boolean {

    // compute the minimum and maximum dot product values: 
    // if values are on the same side of plane -> no intersection

    let min, max;

    if ( plane.normal.x > 0 ) {

			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;

		} else {

			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;

		}

		if ( plane.normal.y > 0 ) {

			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;

		} else {

			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;

		}

		if ( plane.normal.z > 0 ) {

			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;

		} else {

			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;

		}

		return ( min <= - plane.constant && max >= - plane.constant );

	}
	
	applyMatrix4( matrix: Matrix4 ): this {

		_points[0].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
		_points[1].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
		_points[2].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
		_points[3].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
		_points[4].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
		_points[5].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
		_points[6].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
		_points[7].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 111

		this.setFromPoints( _points );

		return this;

	}

	copy( box: Box ): this {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	}

	clone(): Box {

		return new Box().copy( this );

	}

}
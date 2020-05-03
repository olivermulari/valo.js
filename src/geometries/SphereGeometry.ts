import { Geometry } from './Geometry';
import { Vector3 } from '../math/Vector3';

interface SphereGeometryOptions {
  radius?: number;
  subdivisions?: number;
}

export class SphereGeometry extends Geometry {

  radius: number;
  subdivisions: number;

  constructor( options?: SphereGeometryOptions ) {

    super();

    this.radius = options && options.radius ? options.radius : 5;
    this.subdivisions = options && options.subdivisions ? options.subdivisions : 30;

    this.buildGeometry();

  }

  buildGeometry(): void {

    const R = this.radius;
    const segmentsY = this.subdivisions * 2;
    const segmentsX = this.subdivisions;

    const positions = [];
    const indices = [];
    const normals = [];

    // top & bottom
    positions.push( 0, R, 0, 0, -R, 0 );
    normals.push( 0, 1, 0, 0, -1, 0 );

    const _yAxis = new Vector3(0, 1, 0);
    const axis = new Vector3( R, 0, 0 );
    const p1 = new Vector3( 0, R, 0 );

    const stepY = (Math.PI * 2) / segmentsY;
    const stepX = (Math.PI) / segmentsX;

    // row, col
    const indexArray = new Array( segmentsY ).fill(0).map(() => new Array( segmentsX + 1 ).fill(0) );

    let vertex = 2;

    // positions and normals sweep per vertex
    for ( let a = 0; a < segmentsY; a ++ ) {

      const theta = a * stepY;
      axis.set( R, 0, 0 );
      axis.applyAxisAngle( _yAxis, theta );

      indexArray[a][0]         = 0;
      indexArray[a][segmentsX] = 1;

      for ( let b = 1; b < segmentsX; b ++ ) {

        const alpha = b * stepX;

        p1.set( 0, R, 0 );
        p1.applyAxisAngle( axis, alpha );

        positions.push( p1.x, p1.y, p1.z );

        p1.normalize();
        normals.push( p1.x, p1.y, p1.z );

        indexArray[a][b] = vertex++;

      }

      if ( a > 0 ) {

        for (let i = 0; i < segmentsX; i++ ) {

          const p1 = indexArray[a-1][i];
          const p2 = indexArray[a][i];
          const p3 = indexArray[a-1][i+1];
          const p4 = indexArray[a][i+1];

          if ( i === 0 ) {

            indices.push( 0, p4, p3 );

          } else if ( i === segmentsX - 1 ) {

            indices.push( 1, p1, p2 );

          } else {

            indices.push( p1, p2, p3, p2, p4, p3 );
            
          }

        }

      }
      
      if ( a === segmentsY - 1 ) {

        for (let i = 0; i < segmentsX; i++ ) {

          const p1 = indexArray[a][i];
          const p2 = indexArray[0][i];
          const p3 = indexArray[a][i+1];
          const p4 = indexArray[0][i+1];

          if ( i === 0 ) {

            indices.push( 0, p4, p3 );

          } else if ( i === segmentsX - 1 ) {

            indices.push( 1, p1, p2 );

          } else {

            indices.push( p1, p2, p3, p2, p4, p3 );

          }

        }

      }

    }

    this.amountOfVertices = indices.length;

    this.setPositionAttribute(new Float32Array(positions), 3);
    this.setNormalsAttribute(new Float32Array(normals), 3);
    this.setIndicesAttribute(new Uint16Array(indices), 3);

  }

}
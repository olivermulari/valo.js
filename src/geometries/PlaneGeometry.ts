import { Geometry } from './Geometry';
import { MathUtils } from '../math/MathUtils';

interface PlaneGeometryOptions {
  width?: number;
  height?: number;
  subdividions?: number;
}

export class PlaneGeometry extends Geometry {

  width: number;
  height: number;
  subdivisions: number;

  constructor( options?: PlaneGeometryOptions ) {

    super();

    this.width = options && options.width ? options.width : 100;
    this.height = options && options.height ? options.height : 100;
    this.subdivisions = options && options.subdividions ? options.subdividions : 10;

    this.buildGeometry();

  }

  buildGeometry(): void {

    const W = this.width;
    const H = this.height;
    const N = this.subdivisions;

    const amountOfPositions = ( N + 1 ) * ( N + 1 );

    const positions = [];
    const indices = [];
    const normals = Array( amountOfPositions * 3 ).fill( 0 ).map( (n, i) => i % 3 === 1 ? 1 : 0 );

    const stepX = W / N;
    const stepY = H / N;

    // positions sweep per vertice
    for ( let y = 0; y <= N; y ++ ) {
      for ( let x = 0; x <= N; x ++ ) {

        const xCoord = x * stepX - W / 2;
        const zCoord = y * stepY - H / 2;

        positions.push( xCoord, 0, zCoord );

      }
    }

    // indices sweep per square
    for ( let y = 0 ; y < N; y ++ ) {
      for ( let x = 0; x < N; x ++ ) {

        const p1 = MathUtils.index1From2D( x, y, N+1 );
        const p2 = MathUtils.index1From2D( x, y+1, N+1 );
        const p3 = MathUtils.index1From2D( x+1, y, N+1 );
        const p4 = MathUtils.index1From2D( x+1, y+1, N+1 );
        
        indices.push( p1, p3, p2, p2, p3, p4 );

      }
    }

    this.amountOfVertices = indices.length;

    this.setPositionAttribute(new Float32Array(positions), 3);
    this.setNormalsAttribute(new Float32Array(normals), 3);
    this.setIndicesAttribute(new Uint16Array(indices), 3);

  }

}
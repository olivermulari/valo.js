import { Geometry } from './Geometry';

interface BoxGeometryOptions {
  width?: number;
  height?: number;
  depth?: number;
}

export class BoxGeometry extends Geometry {

  width: number;
  height: number;
  depth: number;

  constructor( options?: BoxGeometryOptions ) {
    super();

    this.width = options && options.width ? options.width : 10;
    this.height = options && options.height ? options.height : 10;
    this.depth = options && options.depth ? options.depth : 10;

    this.buildGeometry();

  }

  buildGeometry(): void {

    const w = this.width / 2;
    const h = this.height / 2;
    const d = this.height / 2;

    const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
    const positions = [1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1];
    const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];

    for (let i = 0; i < positions.length; i += 3) {
      positions[i]   *= w;
      positions[i+1] *= h;
      positions[i+2] *= d;
    }

    this.amountOfVertices = 24;

    this.setPositionAttribute(new Float32Array(positions), 3);
    this.setNormalsAttribute(new Float32Array(normals), 3);
    this.setIndicesAttribute(new Uint16Array(indices), 3);

  }
  
}
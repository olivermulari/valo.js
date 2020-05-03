import { Mesh } from '../objects/Mesh';
import { Geometry } from '../geometries/Geometry';

export class BoxHelper {

  mesh: Mesh;
  geometry: Geometry;

  constructor( mesh: Mesh ) {

    this.mesh = mesh;
    this.geometry = new Geometry();

  }

  setGeometry(): void {

    const box = this.mesh.boundingBox.box;

    const minX = box.min.x;
    const maxX = box.max.x;
    const minY = box.min.y;
    const maxY = box.max.y;
    const minZ = box.min.z;
    const maxZ = box.max.z;

    const p = new Float32Array( 24 );
    const indices = new Uint16Array([ 
      0, 1, 1, 2, 2, 3, 3, 0, 
      4, 5, 5, 6, 6, 7, 7, 4, 
      0, 4, 1, 5, 2, 6, 3, 7
    ]);

    // "front"
    p[0] = minX; p[1] = minY; p[2] = minZ;    //000
    p[3] = maxX; p[4] = minY; p[5] = minZ;    //100
    p[6] = maxX; p[7] = maxY; p[8] = minZ;    //110
    p[9] = minX; p[10] = maxY; p[11] = minZ;  //010

    // "back"
    p[12] = minX; p[13] = minY; p[14] = maxZ; //001
    p[15] = maxX; p[16] = minY; p[17] = maxZ; //101
    p[18] = maxX; p[19] = maxY; p[20] = maxZ; //111
    p[21] = minX; p[22] = maxY; p[23] = maxZ; //011

    this.geometry.setPositionAttribute(p, 3);

    if (!this.geometry.hasIndices) {

      this.geometry.setIndicesAttribute(indices, 3);
      
    }

  }

}
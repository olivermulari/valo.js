import { Mesh } from './Mesh';
import { Box } from '../math/Box';

/**
 * Bounding box represents the smallest possible box alinged with object matrix
 * that contains all the objects geometry.
 * 
 * Bounding box is not aligned with main axises.
 * It follows its objects rotation.
 * That is why the frustum calcultaions have to check for rotated bounding boxes
 */
export class BoundingBox {

  mesh: Mesh;
  box: Box;
  positionsNeedsUpdate: boolean;

  constructor( mesh: Mesh ) {

    this.mesh = mesh;

    this.box = new Box();

    this.positionsNeedsUpdate = true;
    
  }

  uptadePositions(): void {

    // TODO: Check all meshes of the object

    const positions = this.mesh.geometry.getPositions();

    this.box.setFromPositions( positions );

    this.positionsNeedsUpdate = false;

  }
  
}
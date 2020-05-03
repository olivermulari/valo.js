import { Object3D } from './Object3D';
import { Geometry } from '../geometries/Geometry';
import { Material } from '../materials/Material';
import { BoundingBox } from './BoundingBox';

export class Mesh extends Object3D {

  geometry: Geometry;
  material: Material;
  boundingBox: BoundingBox;
  children: Array<Mesh>;

  constructor( geometry: Geometry, material: Material ) {

    super();

    this.geometry = geometry;
    this.material = material;
    this.boundingBox = new BoundingBox( this );
    this.children = [];

  }

  /**
   * Child method has a lot of doing with matrix calculations so refactor
   * the relationship between Object3D even further
   */
  addChild( mesh: Mesh ): void {

    if ( this.children.every( child => mesh.id !== child.id ) ) {

      this.children.push( mesh );

    }

  }

}

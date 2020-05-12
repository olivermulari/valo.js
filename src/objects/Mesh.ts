import { Object3D } from './Object3D';
import { Geometry } from '../geometries/Geometry';
import { Material } from '../materials/Material';
import { BoundingBox } from './BoundingBox';
import { RenderItem } from '../renderers/webgl/RenderList';

export class Mesh extends Object3D {

  geometry: Geometry;
  material: Material;
  boundingBox: BoundingBox;
  children: Array<Mesh>;
  _renderItem?: RenderItem;
  _clonedFrom?: Mesh;

  constructor( geometry: Geometry, material: Material ) {

    super();

    this.geometry = geometry;
    this.material = material;
    this.boundingBox = new BoundingBox( this );
    this.children = [];

    this._renderItem;

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

  clone(): Mesh {

    const mesh = new Mesh(this.geometry, this.material);

    mesh._clonedFrom = this;

    return mesh;

  }

  _onRotationChangeCallback(): void {

    this.worldMatrixNeedsUpdate = true;

  }

}

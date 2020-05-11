import { Matrix4 } from '../math/Matrix4';
import { Object3D } from './Object3D';
import { Geometry } from '../geometries/Geometry';
import { Material } from '../materials/Material';
import { BoundingBox } from './BoundingBox';
import { Scene } from '../scenes/Scene';
import { RenderItem } from '../renderers/webgl/RenderList';

export class Mesh extends Object3D {

  viewMatrix: Matrix4;
  viewMatrixNeedsUpdate: boolean;
  geometry: Geometry;
  material: Material;
  boundingBox: BoundingBox;
  children: Array<Mesh>;
  _renderItem?: RenderItem;
  _clonedFrom?: Mesh;

  constructor( geometry: Geometry, material: Material ) {

    super();

    this.viewMatrix = new Matrix4();
    this.viewMatrixNeedsUpdate = true;
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

  updateViewMatrix( scene: Scene ): void {

    const m = this.viewMatrix.copy( scene.viewProjectionMatrix );

    this.viewMatrix = m.multiply( m, this.worldMatrix );

    this.viewMatrixNeedsUpdate = false;

  }

  clone(): Mesh {

    const mesh = new Mesh(this.geometry, this.material);

    mesh._clonedFrom = this;

    return mesh;

  }

  _onRotationChangeCallback(): void {

    this.worldMatrixNeedsUpdate = true;

    this.viewMatrixNeedsUpdate = true;

  }

}

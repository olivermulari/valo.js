import { Scene } from '../scenes/Scene';
import { Matrix4 } from '../math/Matrix4';
import { InteractionManager } from '../interactions/InteractionManager';
import { Object3D } from '../objects/Object3D';
import { Vector3 } from '../math/Vector3';

const _scaleV3 = new Vector3(1, 1, 1);

export class Camera extends Object3D {

  scene: Scene;
  fov: number;
  aspect: number;
  zNear: number;
  zFar: number;
  perspective: Matrix4;
  inversePerspective: Matrix4;
  inverseWorldMatrix: Matrix4;
  worldMatrixNeedsUpdate: boolean;
  perspectiveNeedsUpdate: boolean;

  constructor( scene: Scene ) {
    super();

    this.scene = scene;

    this.fov = 60;
    this.aspect = 1;
    this.zNear = 0.1;
    this.zFar = 2000;

    this.perspective = new Matrix4();
    this.inversePerspective = new Matrix4();
    this.inverseWorldMatrix = new Matrix4();

    this.worldMatrixNeedsUpdate = false;
    this.perspectiveNeedsUpdate = true;

  }

  setActive(): void {

    this.scene.activeCamera = this;
    this.scene.viewMatrixNeedsUpdate = true;

  }

  updateWorldMatrix(): void {

    const m = this.inverseWorldMatrix;
    const translation = this.position;

    this.quaternion.setFromEuler( this.rotation );
    m.compose( translation, this.quaternion, _scaleV3 );
    m.inverse( m );

    this.worldMatrixNeedsUpdate = false;

  }

  updatePerspective(): void {

    const fieldOfViewInRadians = this.fov;
    const aspect = this.aspect;
    const near = this.zNear;
    const far = this.zFar;

    this.perspective.setPerspective( fieldOfViewInRadians, aspect, near, far );

    this.inversePerspective.inverse( this.perspective );

    this.perspectiveNeedsUpdate = false;

  }

  setAspect( ratio: number ): void {

    this.aspect = ratio;
    
    this.perspectiveNeedsUpdate = true;

    this.scene.viewMatrixNeedsUpdate = true;

  }

  forceUpdate(): void {

    this.worldMatrixNeedsUpdate = true;
    this.scene.viewMatrixNeedsUpdate = true;

  }

  updateInteractions( manager: InteractionManager ): void { manager; }

  _onKeyDownCallBack( event: KeyboardEvent ): void { event; }

  _onKeyUpCallBack( event: KeyboardEvent ): void { event; }

  _onRotationChangeCallback(): void {

    this.worldMatrixNeedsUpdate = true;
    this.scene.viewMatrixNeedsUpdate = true;

  }

  _onPositionChangeCallBack(): void {

    this.worldMatrixNeedsUpdate = true;
    this.scene.viewMatrixNeedsUpdate = true;

  }

}
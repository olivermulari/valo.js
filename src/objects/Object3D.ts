import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Euler } from '../math/Euler';
import { Matrix4 } from '../math/Matrix4';
import { Scene } from '../scenes/Scene';

let _object3DID = 0;

const _q1 = new Quaternion();

// rotation calculations
const _v3 = new Vector3();

const _inFront = new Vector3(0, 0, -1);

const _xAxis = new Vector3(1, 0, 0);
const _yAxis = new Vector3(0, 1, 0);
const _zAxis = new Vector3(0, 0, 1);

/**
 * Object3D is an renderable item that can represent only one mesh and its transformations
 * or a group of meshes.
 * 
 * Object3D has bounding boxes.
 */
export class Object3D {

  name: string;
  id: number;
  position: Vector3;
  rotation: Euler;
  quaternion: Quaternion;
  scale: Vector3;
  worldMatrix: Matrix4;
  viewMatrix: Matrix4;
  isObject3D: true;
  worldMatrixNeedsUpdate: boolean;
  viewMatrixNeedsUpdate: boolean;
  isInFrustum: boolean;
  isMesh: boolean;
  isCamera: boolean;

  constructor() {

    this.name = `Object no. ${_object3DID}`;
    this.id = _object3DID++;

    this.position = new Vector3(0, 0, 0);
    this.rotation = new Euler(0, 0, 0);
    this.quaternion = new Quaternion(0, 0, 0, 1);
    this.scale = new Vector3(1, 1, 1);

    this.worldMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();

    this.isObject3D = true;
    this.worldMatrixNeedsUpdate = true;
    this.viewMatrixNeedsUpdate = true;

    this.isInFrustum = false;
    this.isMesh = false;
    this.isCamera = false;
    
  }

  updateWorldMatrix(): void {

    const m = this.worldMatrix;
    const translation = this.position;
    const scale = this.scale;

    this.quaternion.setFromEuler( this.rotation );

    m.compose( translation, this.quaternion, scale );

    this.worldMatrixNeedsUpdate = false;

  }

  updateViewMatrix( scene: Scene ): void {

    const m = this.viewMatrix.copy( scene.viewProjectionMatrix );

    this.viewMatrix = m.multiply( m, this.worldMatrix );

    this.viewMatrixNeedsUpdate = false;

  }

  applyQuaternion( q: Quaternion ): this {

		this.quaternion.multiply( this.quaternion, q );

		return this;

  }

  translateX( amount: number ): this {

    this.position.x += amount;

    return this;

  }

  translateY( amount: number ): this {

    this.position.y += amount;

    return this;

  }

  translateZ( amount: number ): this {

    this.position.z += amount;

    return this;

  }

  translate( v: Vector3 ): this {

    this.position.add( v );

    this._onPositionChangeCallBack();

    return this;

  }

  getDirection(): Vector3 {

    return _v3.copy( _inFront ).applyQuaternion( this.quaternion );

  }
  
  rotateOnAxis( axis: Vector3, angle: number ): this {

    // axis is assumed to be normalized

		_q1.setFromAxisAngle( axis, angle );

    this.quaternion.multiply( _q1, this.quaternion );
    
    this._onRotationChangeCallback();

		return this;

	}

  rotateX( amount: number ): void {

    this.rotation.x += amount;

    this.rotateOnAxis( _xAxis, amount );

    this._onRotationChangeCallback();

  }

  rotateY( amount: number ): void {

    this.rotation.y += amount;

    this.rotateOnAxis( _yAxis, amount );

    this._onRotationChangeCallback();

  }

  rotateZ( amount: number ): void {

    this.rotation.z += amount;

    this.rotateOnAxis( _zAxis, amount );

    this._onRotationChangeCallback();

  }

  rotate( v: Vector3 ): void {

    const x = v.x, y = v.y, z = v.z;

    if ( x !== 0 ) {
      this.rotateX( v.x );
    }

    if ( y !== 0 ) {
      this.rotateY( v.y );
    }
    
    if ( z !== 0 ) {
      this.rotateZ( v.z );
    }

  }

  checkIfUpdateWorldMatrix(): void {

    if (this.worldMatrixNeedsUpdate) {

      this.updateWorldMatrix();

    }

  }

  checkIsInFrustum( scene: Scene ): void {

    const boxIsInFrustum = scene.viewFrustum.intersectsObject( this );

    this.isInFrustum = boxIsInFrustum;

  }

  _onPositionChangeCallBack(): void {

    this.worldMatrixNeedsUpdate = true;

  }

  _onRotationChangeCallback(): void {

    this.worldMatrixNeedsUpdate = true;

    this.viewMatrixNeedsUpdate = true;

  }

  destroy(): void {

    return;

  }

}
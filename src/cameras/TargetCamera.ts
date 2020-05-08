import { Scene } from '../scenes/Scene';
import { Camera } from './Camera';
import { Vector3 } from '../math/Vector3';

const _yAxis = new Vector3(0, 1, 0);

export class TargetCamera extends Camera {

  target: Vector3;

  constructor(scene: Scene) {
    
    super(scene);

    this.target = new Vector3();

  }

  updateWorldMatrix(): void {

    /*
    // BUG: take rotation into account!!
    this.quaternion.setFromEuler( this.rotation );
    this.target.applyQuaternion( this.quaternion );
    */

    this.lookAt( this.target );

    this.worldMatrixNeedsUpdate = false;

    this.scene.viewMatrixNeedsUpdate = true;

  }

  lookAt( target: Vector3 ): this {

    const cameraPosition = this.position;

    const m = this.inverseWorldMatrix;
    
    m.inverse( m.lookAt(cameraPosition, target, _yAxis) );

    return this; 

  }

}
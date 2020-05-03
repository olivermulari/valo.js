import { Scene } from '../scenes/Scene';
import { Camera } from './Camera';
import { Vector3 } from '../math/Vector3';


const upV3 = new Vector3(0, 1, 0);

export class TargetCamera extends Camera {

  target: Vector3;

  constructor(scene: Scene) {
    
    super(scene);

    this.target = new Vector3();

  }

  updateWorldMatrix(): void {

    this.lookAt( this.target );

    this.worldMatrixNeedsUpdate = false;

    this.scene.viewMatrixNeedsUpdate = true;

  }

  lookAt( target: Vector3 ): void {

    const cameraPosition = this.position;
    const up = upV3;

    const m = this.inverseWorldMatrix;
    
    m.inverse( m.lookAt(cameraPosition, target, up) );

  }

}
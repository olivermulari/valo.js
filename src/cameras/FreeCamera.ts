import { Scene } from '../scenes/Scene';
import { Camera } from './Camera';
import { Vector3 } from '../math/Vector3';
import { DIRECTION } from '../constants';
import { InteractionManager } from '../interactions/InteractionManager';

const _v3 = new Vector3();

export class FreeCamera extends Camera {

  speed: number;
  sensitivity: number;
  inverse: boolean;

  constructor(scene: Scene) {
    
    super(scene);

    this.speed = 0.5;
    this.sensitivity = 10;
    this.inverse = false;

  }

  updateInteractions( interactionManager: InteractionManager ): void {

    const direction = interactionManager.direction;
    const orientationUpdate = interactionManager.draggingInfoDidUpdate;

    if (direction !== DIRECTION.NONE) {

      const front = this.getDirection();
      const up = _v3.set( 0, 1, 0 ).applyQuaternion( this.quaternion );

      // TODO: ease in and out

      switch (direction) {

        case DIRECTION.UP:
          break;

        case DIRECTION.UR:
          front.applyAxisAngle( up, - Math.PI / 4 );
          break;

        case DIRECTION.RIGHT:
          front.applyAxisAngle( up, - Math.PI / 2 );
          break;

        case DIRECTION.DR:
          front.applyAxisAngle( up, - Math.PI * 3 / 4 );
          break;
  
        case DIRECTION.DOWN:
          front.inverse( front );
          break;
        
        case DIRECTION.DL:
          front.applyAxisAngle( up, Math.PI * 3 / 4 );
          break;

        case DIRECTION.LEFT:
          front.applyAxisAngle( up, Math.PI / 2 );
          break;

        case DIRECTION.UL:
          front.applyAxisAngle( up, Math.PI / 4 );
          break;

      }

      this.translate( front.multiply( this.speed ) );

    }

    if ( orientationUpdate ) {

      const info = interactionManager.draggingInfo;
      const sign = this.inverse ? -1 : 1;
      const multiplier = sign * 0.0005 * this.sensitivity;

      this.rotateX( (info.y0 - info.y1) * multiplier );
      this.rotateY( (info.x0 - info.x1) * multiplier );

    }

  }

}
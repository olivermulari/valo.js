import { CanvasManager } from './CanvasManager';
import { Scene } from '../scenes/Scene';
import { DIRECTION } from '../constants';

// const _listeners = [];
interface DraggingInfo {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export class InteractionManager {

  canvas: CanvasManager;
  direction: number;
  draggingInfo: DraggingInfo;
  isDragging: boolean;
  draggingInfoDidUpdate: boolean;

  constructor( manager: CanvasManager ) {

    this.canvas = manager;

    this.direction = DIRECTION.NONE;
    this.isDragging = false;
    this.draggingInfo = {
      x0: 0, y0: 0, x1: 0, y1: 0
    };

    this.draggingInfoDidUpdate = false;

  }

  _init( canvas: HTMLCanvasElement ): void {

    document.onkeydown = this._onKeyDown;
    document.onkeyup = this._onKeyUp;

    canvas.onpointerdown = this._onPointerDown;
    canvas.onpointermove = this._onPointerMove;
    canvas.onpointerup = this._onPointerUp;
    canvas.onpointerleave = this._onPointerLeave;

  }

  updateScene( scene: Scene ): void {

    if (scene.activeCamera) {

      scene.activeCamera.updateInteractions( this );

    }

    // after update

    this.draggingInfoDidUpdate = false;

  }

  _onPointerDown = ( event: PointerEvent ): void => {

    const info = this.draggingInfo;
    info.x0 = event.clientX;
    info.y0 = event.clientY;
    info.x1 = event.clientX;
    info.y1 = event.clientY;
    this.isDragging = true;

  };

  _onPointerUp = ( event: PointerEvent ): void => {

    this.isDragging = false;

  };

  _onPointerMove = ( event: PointerEvent ): void => {

    if (this.isDragging) {

      const info = this.draggingInfo;
      info.x0 = info.x1;
      info.y0 = info.y1;
      info.x1 = event.clientX;
      info.y1 = event.clientY;

      this.draggingInfoDidUpdate = true;

    }
    
  }; 

  _onPointerLeave = ( event: PointerEvent ): void => {

    this.isDragging = false;

  };

  _onKeyDown = ( event: KeyboardEvent ): void => {

    const key = event.which;

    switch (key) {

      // ArrowUp & W
      case 38:
      case 87:
        event.preventDefault();
        if (this.direction === DIRECTION.RIGHT) {
          this.direction = DIRECTION.UR;

        } else if (this.direction === DIRECTION.LEFT) {
          this.direction = DIRECTION.UL;

        } else if (this.direction === DIRECTION.DR) {
          this.direction = DIRECTION.UR;

        } else if (this.direction === DIRECTION.DL) {
          this.direction = DIRECTION.UL;

        } else if (this.direction === DIRECTION.NONE) {
          this.direction = DIRECTION.UP;
        }
        break;
      
      // ArrowDown & S
      case 40:
      case 83:
        event.preventDefault();
        if (this.direction === DIRECTION.RIGHT) {
          this.direction = DIRECTION.DR;

        } else if (this.direction === DIRECTION.LEFT) {
          this.direction = DIRECTION.DL;

        } else if (this.direction === DIRECTION.UR) {
          this.direction = DIRECTION.DR;

        } else if (this.direction === DIRECTION.UL) {
          this.direction = DIRECTION.DL;

        } else if (this.direction === DIRECTION.NONE) {
          this.direction = DIRECTION.DOWN;
        }
        break;

      // ArrowLeft & A
      case 37:
      case 65:
        event.preventDefault();
        if (this.direction === DIRECTION.UP) {
          this.direction = DIRECTION.UL;

        } else if (this.direction === DIRECTION.DOWN) {
          this.direction = DIRECTION.DL;

        } else if (this.direction === DIRECTION.UR) {
          this.direction = DIRECTION.UL;

        } else if (this.direction === DIRECTION.DR) {
          this.direction = DIRECTION.DL;

        } else if (this.direction === DIRECTION.NONE) {
          this.direction = DIRECTION.LEFT;
        }
        break;

      // ArrowRight & D
      case 39:
      case 68:
        event.preventDefault();
        if (this.direction === DIRECTION.UP) {
          this.direction = DIRECTION.UR;

        } else if (this.direction === DIRECTION.DOWN) {
          this.direction = DIRECTION.DR;

        } else if (this.direction === DIRECTION.UL) {
          this.direction = DIRECTION.UR;

        } else if (this.direction === DIRECTION.DL) {
          this.direction = DIRECTION.DR;

        } else if (this.direction === DIRECTION.NONE) {
          this.direction = DIRECTION.RIGHT;
        }
        break;

    }

  };

  

  _onKeyUp = ( event: KeyboardEvent ): void => {

    const key = event.which;

    switch (key) {

      // ArrowUp & W
      case 38:
      case 87:
        event.preventDefault();
        if (this.direction === DIRECTION.UP) {
          this.direction = DIRECTION.NONE;
        } else if (this.direction === DIRECTION.UL) {
          this.direction = DIRECTION.LEFT;
        } else if (this.direction === DIRECTION.UR) {
          this.direction = DIRECTION.RIGHT;
        }
        break;

      // ArrowDown & S
      case 40:
      case 83:
        event.preventDefault();
        if (this.direction === DIRECTION.DOWN) {
          this.direction = DIRECTION.NONE;
        } else if (this.direction === DIRECTION.DL) {
          this.direction = DIRECTION.LEFT;
        } else if (this.direction === DIRECTION.DR) {
          this.direction = DIRECTION.RIGHT;
        }
        break;

      // ArrowLeft & A
      case 37:
      case 65:
        event.preventDefault();
        if (this.direction === DIRECTION.LEFT) {
          this.direction = DIRECTION.NONE;
        } else if (this.direction === DIRECTION.UL) {
          this.direction = DIRECTION.UP;
        } else if (this.direction === DIRECTION.DL) {
          this.direction = DIRECTION.DOWN;
        }
        break;

      // ArrowRight & D
      case 39:
      case 68:
        event.preventDefault();
        if (this.direction === DIRECTION.RIGHT) {
          this.direction = DIRECTION.NONE;
        } else if (this.direction === DIRECTION.UR) {
          this.direction = DIRECTION.UP;
        } else if (this.direction === DIRECTION.DR) {
          this.direction = DIRECTION.DOWN;
        }
        break;

    }

  };

  destroy(): void {
    /*
    _listeners.forEach(listener => {
      listener.element.removeEventListener(listener.listener);
    });
    */
  }

}
import { BoxHelper } from './BoxHelper';
import { CameraHelper } from './CameraHelper';
import { Object3D } from '../objects/Object3D';
import { Camera } from '../cameras/Camera';
import { Mesh } from '../objects/Mesh';

export class HelperManager {

  boxes: Array<BoxHelper>;
  cameras: Array<CameraHelper>;


  constructor() {

    this.boxes = [];
    this.cameras = [];

  }

  add( obj: Object3D ): void {

    let helper = null;

    if ( obj instanceof Camera ) {

      helper = new CameraHelper( obj );  
      this.cameras.push( helper );


    } else if ( obj instanceof Mesh ) {

      helper = new BoxHelper( obj );
      this.boxes.push( helper );
      
    }

  }

}
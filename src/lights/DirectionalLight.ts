import { Vector3 } from '../math/Vector3';
import { Light } from './Light';

export class DirectionalLight extends Light {

  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
  reverseDirection: Vector3;

  constructor() {
    super();

    this.ambient = new Vector3(0.2, 0.2, 0.2);
    this.diffuse = new Vector3(0.5, 0.5, 0.5);
    this.specular = new Vector3(1.0, 1.0, 1.0);
    this.reverseDirection = new Vector3(0, 1, 0);
    this.type = 'directional';

    Light.push(this);
  }

}
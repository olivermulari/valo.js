import { Material } from './Material';
import { Vector3 } from '../math/Vector3';

export class StandardMaterial extends Material {

  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
  shininess: number;

  constructor() {

    super();

    this.ambient = new Vector3(0.0215, 0.1745, 0.0215);
    this.diffuse = new Vector3(0.07568, 0.61424, 0.07568);
    this.specular = new Vector3(0.633, 0.727811, 0.633);
    this.shininess = 26;
    this.type = 'standard';

  }
  
}
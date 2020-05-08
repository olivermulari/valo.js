import { Material } from './Material';
import { Vector3 } from '../math/Vector3';

export class NaiveMaterial extends Material {

  color: Vector3;

  constructor( color: Vector3 ) {

    super();

    this.color = color;
    this.type = 'naive';

  }
  
}
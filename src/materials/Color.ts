import { Material } from './Material';
import { Vector3 } from '../math/Vector3';

export class Color extends Material {

  color: number[];

  constructor( r: number, g: number, b: number, a: number ) {

    super();

    this.color = [r || 1, g || 1, b || 1, a || 1];

    this.type = 'color';

  }
  
}
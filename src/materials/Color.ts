import { Material } from './Material';

export class Color extends Material {

  color: number[];

  constructor( r?: number, g?: number, b?: number, a?: number ) {

    super();

    this.color = [r !== undefined ? r : 1, g !== undefined ? g : 1, b !== undefined ? b : 1, a !== undefined ? a : 1];

    this.type = 'color';

  }
  
}
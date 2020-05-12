import { Vector3 } from '../../math/Vector3';

export class Uniform {

  name: string;
  type: string;
  offset: number;
  dataLen: number;
  chunkLen: number;
  arylen: number;
  arr: Float32Array;

  constructor(name: string, type: string) {

    this.name = name;
    this.type = type;
    this.offset = 0;
    this.dataLen = 0;
    this.chunkLen = 0;
    this.arylen = 0;

    this.arr = new Float32Array( Uniform.getSize(type) ).fill(0);

  }

  updateAry( data: Array<number> | Vector3 | number ): Float32Array {

    if ( data instanceof Vector3 ) {

      this.arr[0] = data.x;
      this.arr[1] = data.y;
      this.arr[2] = data.z;

    } else if ( Array.isArray( data ) ) {

      for (let i = 0; i < data.length; i++) {
        this.arr[i] = data[i];
      }

    } else {

      this.arr[0] = data;

    }

    return this.arr;

  }

  static getSize(type: string): number {
		switch(type){
			case 'mat4': return 16;
			case 'mat3': return 16;
			case 'vec2': return 2;
			case 'f': case 'i': case 'b': return 1;
			case 'vec3': case 'vec4': return 4;
			default: return 0;
		}
	}

}
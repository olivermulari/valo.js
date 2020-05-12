import { Uniform } from './Uniform';
import { Vector3 } from '../../math/Vector3';

interface UBOItems {
  [key: string]: Uniform;
}

interface UBOCache {
  [key: string]: UBO;
}

/**
 * Uniform buffer object container
 */
export class UBO {

  gl: WebGL2RenderingContext;
  name: string;
  blockPoint: number;
  items: UBOItems;
  keys: Array<string>;
  buffer: WebGLBuffer | null;
  static cache: UBOCache;

	constructor(gl: WebGL2RenderingContext, name: string, blockPoint: number, bufSize: number, aryCalc: Array<Uniform>){
		this.items = {};
		this.keys = [];
		
		for(let i=0; i < aryCalc.length; i++){
			this.items[aryCalc[i].name]	= aryCalc[i];
      this.keys[i] = aryCalc[i].name;
		}
		
		this.gl = gl;
		this.name = name;
		this.blockPoint = blockPoint;

		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
		gl.bufferData(gl.UNIFORM_BUFFER, bufSize, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, blockPoint, this.buffer);
    
	}

	// This function has low performance!
	update(name: string, data: Array<number> | Vector3 | number): this {
		const uniform = this.items[name];
		const arr = uniform.updateAry( data );
		const offset = uniform.offset;
		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
		this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, arr, 0);
		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
		return this;
	}

	static create(gl: WebGL2RenderingContext, blockName: string, blockPoint: number, uniforms: Array<Uniform>): void {
    const ary = [...uniforms];
		const bufSize = UBO.calculate(ary);
		UBO.cache[blockName] = new UBO(gl, blockName, blockPoint, bufSize, ary);
	}

	static getSize(type: string): number {
		switch(type){
			case 'mat4': return 16*4;
			case 'mat3': return 16*3;
			case 'vec2': return 8;
			case 'f': case 'i': case 'b': return 4;
			case 'vec3': case 'vec4': return 16;
			default: return 0;
		}
	}

	static calculate(ary: Array<Uniform>): number {
		let chunk = 16,
			tsize = 0,
			offset = 0,
			size = 0;

		for (let i=0; i < ary.length; i++) {
			//When dealing with arrays, Each element takes up 16 bytes regardless of type.
			if (!ary[i].arylen || ary[i].arylen == 0) size = UBO.getSize(ary[i].type);
			else size = ary[i].arylen * 16;

			tsize = chunk-size;

			if (tsize < 0 && chunk < 16) {
				offset += chunk;
				if (i > 0) ary[i-1].chunkLen += chunk;
				chunk = 16;
			} else if (tsize < 0 && chunk == 16) {
				// Do nothing
			} else if (tsize== 0)	chunk = 16;
			else chunk -= size;

			ary[i].offset = offset;
			ary[i].chunkLen = size;
			ary[i].dataLen = size;

			offset += size;
		}

		if(offset % 16 != 0){
			ary[ary.length-1].chunkLen += chunk;
			offset += chunk;
		}

		return offset;
	}

}

UBO.cache = {};
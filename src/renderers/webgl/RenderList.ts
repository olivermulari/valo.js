import { Object3D } from '../../objects/Object3D';
import { Program } from './Program';
import { ProgramManager } from './ProgramManager';
import { Scene } from '../../scenes/Scene';
import { Geometry } from '../../geometries/Geometry';
import { Mesh } from '../../objects/Mesh';
import { Material } from '../../materials/Material';
import { NaiveMaterial } from '../../materials/NaiveMaterial';
import { StandardMaterial } from '../../materials/StandardMaterial';
import { Color } from '../../materials/Color';

export interface RenderItem {
	id: number;
	mesh: Mesh;
	geometry: Geometry;
	material: Material | NaiveMaterial | StandardMaterial | Color;
	program: Program;
	//renderOrder: number;
	//z: number;
}

/**
 * Current implementation assumes every object has its own rendering object.
 * 
 * TODO: optimize rendering lists:
 * 
 * 1. Each render list should have only one program that can be binded once
 */
export class RenderList {

  items: Array<RenderItem>;

  constructor() {

    this.items = [];
    
  }

  push( mesh: Mesh, program: Program ): void {

    this.items.push({

      id: mesh.id,
      mesh: mesh,
      material: mesh.material,
      geometry: mesh.geometry,
      program: program,
      
    });

  }
  
  /**
   * Currently updates render list only if it is added items
   * 
   * TODO: update correctly in deletion
   */
  checkIfUpdate( gl: WebGL2RenderingContext, programManager: ProgramManager, scene: Scene ): void {

    if ( scene.meshListDidUpdate ) {

      const missingMeshes: Array<Mesh> = [];

      scene.meshes.forEach( mesh => {

        if ( !this.items.find( item => item.id === mesh.id ) ) {

          missingMeshes.push(mesh);

        }

      });

      missingMeshes.forEach( mesh => {

        const program = programManager.figureProgramForMesh( mesh );

        if (!program) { console.error('VALO.RenderList: checkIfUpdate() program was not complied correctly'); return;}

        this.push( mesh, program );

      });

    }

    if ( scene.buffersNeedUpdate ) {

      this.items.forEach(item => {
        
        const geometry = item.geometry;
        geometry.setBuffers(gl);
        geometry.bindBuffers(gl, item.program);

      });

    }

  }

  // pls implement
  delete( object: Object3D ): void {

    console.log('tried to delete object', object);

    return;

  }

  destroy(): void {

    return;

  }

}
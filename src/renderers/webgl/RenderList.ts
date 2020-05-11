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
}

/**
 * Current implementation assumes every object has its own rendering object.
 * 
 * TODO: optimize rendering lists:
 * 
 * 1. Each render list should have only one program that can be binded once
 */
export class RenderList {

  program: Program;
  items: Array<RenderItem>;

  constructor( program: Program ) {

    this.program = program;
    this.items = [];
    
  }

  push( mesh: Mesh ): void {

    const item = {

      id: mesh.id,
      mesh: mesh,
      material: mesh.material,
      geometry: mesh.geometry,
      program: this.program,
      
    };

    mesh._renderItem = item;

    this.items.push(item);

  }
  
  /**
   * Currently updates render list only if it is added items
   * 
   * TODO: update correctly in deletion
   */
  static checkIfUpdate( gl: WebGL2RenderingContext, programManager: ProgramManager, scene: Scene ): void {

    if ( scene.meshListDidUpdate ) {

      const missingMeshes: Array<Mesh> = [];

      scene.meshes.forEach( mesh => {

        if ( mesh._renderItem === undefined ) {

          missingMeshes.push(mesh);

        }

      });

      missingMeshes.forEach( mesh => {

        const list = scene.renderLists.find(l => l.program.targetMaterial == mesh.material.type );

        if ( list !== undefined ) {

          list.push( mesh );

        } else {

          // create new render list

          const program = programManager.createProgramForMesh( mesh );

          if (!program) { console.error('VALO.RenderList: checkIfUpdate() program was not complied correctly'); return;}

          const renderList = new RenderList( program );
          renderList.push( mesh );
          scene.renderLists.push( renderList );

        }

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
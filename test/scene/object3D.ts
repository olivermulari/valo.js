import { assert } from 'chai';
import { Object3D } from '../../src/objects/Object3D';
import { Mesh } from '../../src/objects/Mesh';

import { StandardMaterial } from '../../src/materials/StandardMaterial';
import { BoxGeometry } from '../../src/geometries/BoxGeometry';


export default function object3D(): void {

  it('Should create a object', () => {

    const geometry = new BoxGeometry();
    const material = new StandardMaterial();
    const box = new Mesh(geometry, material);
  
    assert.ok( box instanceof Object3D );
  
  });

}


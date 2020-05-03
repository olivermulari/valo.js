import { assert } from 'chai';
import { Euler } from '../../src/math/Euler';
import { Quaternion } from '../../src/math/Quaternion';
import { Vector3 } from '../../src/math/Vector3';

export default function euler(): void {
  
  it('Should create a Euler', () => {

    const euler = new Euler();

    assert.ok( euler instanceof Euler );

  });

  it('Conversion from Quaternion 1', () => {

    const rotations = [
      new Vector3( 1, 0, 0 ),
      new Vector3( -1, 0, 0 ),
      new Vector3( 0, 1, 0 ),
      new Vector3( 0, -1, 0 ),
      new Vector3( 0, 0, 1 ),
      new Vector3( 0, 0, -1 ),
    ].map( v => v.multiply( Math.PI / 2 ) );

    rotations.forEach(rot => {

      const q1 = new Quaternion().setFromAxisAngle( rot, Math.PI / 2 );
      const e2 = new Euler().setFromQuaternion( q1 );

      rot.multiply( Math.PI / 2 );

      const e1 = new Euler( rot.x, rot.y, rot.z );

      assert.ok( e1.equals( e2, 0.001 ) );

    });
    
  });

}
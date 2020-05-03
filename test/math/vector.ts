import { assert } from 'chai';
import { Vector3 } from '../../src/math/Vector3';

export default function vector(): void {

  let v3: Vector3;
  
  it('Should create a Vector', function() {

    v3 = new Vector3();

    assert.ok( v3 instanceof Vector3 );

  });

  it('normalize()', function() {

    const vectors: Array<Vector3> = [];

    for (let i = 1; i <= 1000; i++) {

      const v = new Vector3(0, 0, 0);

      while( v.mag() === 0 ) {

        const x = ( Math.random() - 0.5 ) * i;
        const y = ( Math.random() - 0.5 ) * i;
        const z = ( Math.random() - 0.5 ) * i;

        v.set(x, y, z);

      }

      v.normalize();

      vectors.push( v );

    }

    const error = 0.00000000000001;
    const notUnitVec = (v: Vector3): boolean => {

      return Math.abs( v.mag() - 1.0 ) >= error;

    };

    assert.ok( vectors.find(notUnitVec) === undefined );

  });

}
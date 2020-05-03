import { assert } from 'chai';
import { Plane } from '../../src/math/Plane';
import { Vector3 } from '../../src/math/Vector3';

function randomPlane(n: number): Plane {

  const p = new Plane();

  while( p.normal.mag() === 0 ) {

    const x = ( Math.random() - 0.5 ) * n;
    const y = ( Math.random() - 0.5 ) * n;
    const z = ( Math.random() - 0.5 ) * n;
    const w = ( Math.random() - 0.5 ) * n;

    p.setComponents(x, y, z, w);

  }

  p.normalize();

  return p;

}

function randomVector(n: number): Vector3 {

  const x = ( Math.random() - 0.5 ) * n;
  const y = ( Math.random() - 0.5 ) * n;
  const z = ( Math.random() - 0.5 ) * n;
  
  return new Vector3(x, y, z);

}

export default function plane(): void {
  
  it('Should create a Plane', () => {

    assert.ok( new Plane() instanceof Plane );

  });

  it('normalize()', () => {

    const planes: Array<Plane> = [];

    for (let i = 1; i <= 1000; i++) {

      const p = randomPlane( i );

      planes.push( p );

    }

    const error = 0.00000000000001;
    
    const notNormalized = (v: Plane): boolean => {

      return Math.abs( v.normal.mag() - 1.0 ) >= error;

    };

    assert.ok( planes.find(notNormalized) === undefined );

  });

  it('negate()', () => {

    const N = 1000;
    const points: Array<Vector3> = [];
    const planes: Array<Plane> = [];
    const d1: Array<number> = [];
    const d2: Array<number> = [];

    for (let i = 0; i < N; i++) {

      const v = randomVector( i );
      points.push( v );

      const p = randomPlane( i );
      planes.push( p );

    }

    planes.forEach((p, i) => {

      const point = points[i];
      let dist = p.distanceToPoint(point);
      d1.push(dist);

      p.negate();
      dist = p.distanceToPoint(point);
      d2.push(dist);

    });

    assert.equal( d1.reduce( (p, c, i) => p + c + d2[i] ), 0 );

  });

  it('distanceToPoint()', () => {

    const origin = new Vector3(0, 0, 0);
    const a = new Plane( new Vector3(4, 4, 4), 4 );

    // negate of normalized Plane

    a.normalize();
    assert.equal( a.distanceToPoint(origin), 0.5773502691896258);
    a.negate();
    assert.equal( a.distanceToPoint(origin), -0.5773502691896258);

    // plane that has normal pointing up

    a.setComponents(0, 0, 1, 0);
    a.normalize();
    for (let i = 0; i < 1000; i++) {

      const v = randomVector(i);
      assert.equal( a.distanceToPoint( v ), v.z );

    }

  });

}
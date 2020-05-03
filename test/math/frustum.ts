import { assert } from 'chai';
import { Matrix4 } from '../../src/math/Matrix4';
import { Frustum } from '../../src/math/Frustum';
import { Vector3 } from '../../src/math/Vector3';
import { Box } from '../../src/math/Box';

function perspective(fov: number, aspec: number, zNear: number, zFar: number): Matrix4 {

  const fieldOfViewInRadians = fov;
  const aspect = aspec;
  const near = zNear;
  const far = zFar;

  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);
  
  return new Matrix4().set(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0,
  );

}

export default function frustum(): void {
  
  it('Should create a Frustum', () => {

    assert.ok( new Frustum() instanceof Frustum );

  });

  it('setFromProjectionMatrix()', () => {

    const pos = new Vector3(0, 0, 0);
    const trg = new Vector3(0, 0, 1);
    const up = new Vector3(0, 1, 0);

    const p = perspective( 1, 1, 1, 200 );
    let w = new Matrix4().lookAt( pos, trg, up );
    w = w.inverse(w);

    const f = new Frustum().setFromProjectionMatrix( p.multiply( p, w ) );

    assert.ok( f.containsPoint( trg.set(0, 0, 1.00001) ) );
    assert.ok( f.containsPoint( trg.set(0, 0, 199.99) ) );

  });

  it('containsPoint()', () => {
    
    const pos = new Vector3(0, 0, 0);
    const trg = new Vector3(0, 0, 1);
    const up = new Vector3(0, 1, 0);

    const p = perspective( 1, 1, 1, 200 );
    let w = new Matrix4().lookAt( pos, trg, up );
    w = w.inverse(w);

    const f = new Frustum().setFromProjectionMatrix( p.multiply( p, w ) );

    assert.ok( f.containsPoint( trg.set(0, 0, 1.00001) ) );
    assert.ok( f.containsPoint( trg.set(0, 0, 199.99) ) );
    assert.ok( !f.containsPoint( trg.set(0, 0, 0.9999) ) );
    assert.ok( !f.containsPoint( trg.set(0, 0, 200.001) ) );

  });

  it('intersectsBox()', () => {

    const pos = new Vector3(0, 0, 0);
    const trg = new Vector3(0, 0, 1);
    const up = new Vector3(0, 1, 0);

    const p = perspective( 1, 1, 1, 200 );
    let w = new Matrix4().lookAt( pos, trg, up );
    w = w.inverse(w);

    const f = new Frustum().setFromProjectionMatrix( p.multiply( p, w ) );

    const min = new Vector3(-1, -1, -1);
    const max = new Vector3(1, 1, 1);
    const box = new Box( min, max );

    assert.ok( f.intersectsBox( box ) );

    box.min.set(-2, -2, 100);
    box.max.set(2, 2, 101);

    assert.ok( f.intersectsBox( box ) );

    box.min.set(1, 1, 1000);
    box.max.set(1, 1, 1001);

    assert.ok( !f.intersectsBox( box ) );

  });

}
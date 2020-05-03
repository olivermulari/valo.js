import { assert } from 'chai';
import { Mesh } from '../../src/objects/Mesh';
import { BoxGeometry } from '../../src/geometries/BoxGeometry';
import { StandardMaterial } from '../../src/materials/StandardMaterial';
import { Scene } from '../../src/scenes/Scene';
import { Camera } from '../../src/cameras/Camera';
import { Matrix4 } from '../../src/math/Matrix4';
import { Vector3 } from '../../src/math/Vector3';
import { Frustum } from '../../src/math/Frustum';

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

export default function scene(): void {

  it('Should create a scene', () => {

    assert.ok( new Scene() instanceof Scene);

  });

  it('adding and deleting to scene', () => {

    const scene = new Scene();

    const geometry = new BoxGeometry();
    const material = new StandardMaterial();
    const box = new Mesh(geometry, material);

    scene.deleteMesh( box );
    scene.add( box );
    assert.equal( scene.meshes.length, 1 );

    scene.add( box );
    assert.equal( scene.meshes.length, 1 );

  });

  it('onBeforeRender()', () => {
    assert.ok(true);
  });

  it('isInFrustum matches Frustum calculations', () => {

    const scene = new Scene();

    const geometry = new BoxGeometry();
    const material = new StandardMaterial();
    const box = new Mesh(geometry, material);
    box.position.z = 100;
    scene.add( box );

    const pos = new Vector3(0, 0, 0);
    const trg = new Vector3(0, 0, -10);
    const up = new Vector3(0, 1, 0);

    const p = perspective( 1, 1, 1, 2000 );
    let w = new Matrix4().lookAt( pos, trg, up );
    w = w.inverse(w);

    const frustum = new Frustum().setFromProjectionMatrix( p.multiply( p, w ) );

    const camera = new Camera(scene);
    camera.setActive();

    const testAmount = 10;

    for (let i = 1; i <= testAmount; i++) {

      const x = (Math.random() - 0.5) * i * 100;
      const y = (Math.random() - 0.5) * i * 100;
      const z = (Math.random() - 0.5) * i * 100;

      box.position.set(x, y, z);
      box.worldMatrixNeedsUpdate = true;
      scene.onBeforeRender();
      
      assert.equal( frustum.intersectsObject( box ), box.isInFrustum );

    }

  });

  it('isInFrustum', () => {

    const scene = new Scene();

    const geometry = new BoxGeometry();
    const material = new StandardMaterial();
    const box = new Mesh(geometry, material);
    box.position.z = 100;
    scene.add( box );

    const camera = new Camera(scene);
    camera.setActive();

    scene.onBeforeRender();
    assert.ok( box.isInFrustum );

    /*
    box.position.z = 10000;
    scene.onBeforeRender();
    assert.ok( !box.isInFrustum );
    */

  });

}
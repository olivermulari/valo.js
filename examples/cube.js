/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import VALO from '../src/index';

function map(t, x, y, a, b) {
  return a + (t - x) * (b - a) / (y - x);
}

const _v3 = new VALO.Vector3();

function toBall( mesh ) {
  mesh.position.add(_v3.copy(mesh.position).multiply(0.01));
  if (mesh.position.mag() > 20) {
    mesh.position.normalize().multiply(20);
  }
}

function toInit( mesh ) {
  mesh.position.add(_v3.copy(mesh.initialPosition).subtract(mesh.position).multiply(0.02));
}

export function cube() {

  const renderer = new VALO.WebGLRenderer({ 
    clearBeforeRender: true,
    antialiazing: true,
    inspector: false,
    pixelRatio: 2
  });

  renderer.attachTo('scene-div');

  const scene = new VALO.Scene();

  const camera = new VALO.TargetCamera(scene);
  camera.target = new VALO.Vector3(0, 0, 0);
  camera.translateZ( -50 );
  camera.rotateY( Math.PI );
  camera.setActive();

  const N = 8;
  const W = 20;
  const size = W / N;
  const center = new VALO.Vector3(0, 0, 0);

  const geometry = new VALO.BoxGeometry({width: size, height: size, depth: size});
  const material = new VALO.Color(0.5, 0.5, 0.2);
  const box = new VALO.Mesh(geometry, material);

  const boxes = [];

  for (let yi = 0; yi < N; yi++) {
    for (let xi = 0; xi < N; xi++) {
      for (let zi = 0; zi < N; zi++) {
        if (yi == 0 || xi == 0 || zi == 0 || yi == N-1 || xi == N-1 || zi == N-1) {
          const r = map(xi, 0, N-1, 0, 1);
          const g = map(yi, 0, N-1, 0, 1);
          const b = map(zi, 0, N-1, 0, 1);
          const mat = new VALO.Color(r, g, b);
          const bc = box.clone();
          bc.position.x = (xi * size + size/2) - W / 2;
          bc.position.y = (yi * size + size/2) - W / 2;
          bc.position.z = (zi * size + size/2) - W / 2; 
          bc.position.add(center);

          const scaleFactor = center.clone().add(bc.position).mag();
          bc.applyScale(map(scaleFactor, 10, 15, 0.4, 1.0));

          bc.material = mat;
          bc.initialPosition = new VALO.Vector3().copy(bc.position);
          scene.add(bc);
          boxes.push(bc);
        }
      }
    }
  }

  const _yAxis = new VALO.Vector3(0, 1, 0);
  const _xAxis = new VALO.Vector3(0, 1, 0);

  let frames = 0;
  renderer.runRenderLoop(() => {

    renderer.render(scene);
    frames++;

    camera.position.applyAxisAngle(_yAxis, 0.015);
    camera.position.applyAxisAngle(_xAxis, 0.015);
    camera.update();


    if (Math.sin(frames / 30) > 0.0) {
      boxes.forEach(toBall);
    } else {
      boxes.forEach(toInit);
    }
    

  });
}
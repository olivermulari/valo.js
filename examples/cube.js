/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import VALO from '../src/index';

function map(t, x, y, a, b) {
  return a + (t - x) * (b - a) / (y - x);
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
          scene.add(bc);
          boxes.push(bc);
        }
      }
    }
  }

  const _yAxis = new VALO.Vector3(0, 1, 0);

  renderer.runRenderLoop(() => {


    renderer.render(scene);
    camera.position.applyAxisAngle(_yAxis, 0.015);
    camera.position.applyAxisAngle(new VALO.Vector3(1, 0, 0), 0.015);
    camera.update();

  });
}
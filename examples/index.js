/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { cube } from './cube.js';
import VALO from '../src/index';

function createScene() {

  const renderer = new VALO.WebGLRenderer({ 
    clearBeforeRender: true,
    antialiazing: true,
    inspector: false,
  });

  renderer.attachTo('scene-div');

  const scene = new VALO.Scene();
  new VALO.DirectionalLight();

  scene.helperManager = new VALO.HelperManager();

  const camera = new VALO.FreeCamera(scene);
  camera.position.x = 20;
  camera.position.y = 10;
  camera.rotateY( Math.PI );
  camera.setActive();

  const plane = new VALO.PlaneGeometry();
  const planeMat = new VALO.StandardMaterial();

  const floor = new VALO.Mesh(plane, planeMat);
  scene.add(floor);

  const geometry = new VALO.BoxGeometry();
  const material = new VALO.StandardMaterial();

  const box = new VALO.Mesh(geometry, material);
  box.position.y = 10;
  box.position.z = 50;
  scene.add(box);

  const geometry2 = new VALO.SphereGeometry();

  const sphere = new VALO.Mesh(geometry2, material);
  scene.helperManager.add(sphere);
  sphere.position.x = 20;
  sphere.position.y = 10;
  sphere.position.z = 50;
  scene.add(sphere);

  const rot = new VALO.Vector3(1, 1, 1).multiply(0.01);

  renderer.runRenderLoop(() => {

    sphere.rotate(rot);
    box.rotate(rot);
    renderer.render(scene);

  });
}

window.addEventListener('DOMContentLoaded', cube);
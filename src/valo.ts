import { BoxGeometry } from './geometries/BoxGeometry';
import { PlaneGeometry } from './geometries/PlaneGeometry';
import { SphereGeometry } from './geometries/SphereGeometry';
import { WebGLRenderer } from './renderers/WebGLRenderer';
import { Scene } from './scenes/Scene';
import { StandardMaterial } from './materials/StandardMaterial';
import { NaiveMaterial } from './materials/NaiveMaterial';
import { Mesh } from './objects/Mesh';

import { DirectionalLight } from './lights/DirectionalLight';

import { Camera } from './cameras/Camera';
import { FreeCamera } from './cameras/FreeCamera';

import { Vector3 } from './math/Vector3';

import { HelperManager } from './helpers/HelperManager';

/*
const VALO = {
  BoxGeometry: BoxGeometry,
  WebGLRenderer: WebGLRenderer,
  Scene: Scene,
  Camera: Camera,
  StandardMaterial: StandardMaterial,
  Mesh: Mesh,
  MeshBuilder: MeshBuilder,
};
*/

class VALO {

  static BoxGeometry = BoxGeometry;
  static PlaneGeometry = PlaneGeometry;
  static SphereGeometry = SphereGeometry;

  static NaiveMaterial = NaiveMaterial;
  static StandardMaterial = StandardMaterial;

  static DirectionalLight = DirectionalLight;

  static Mesh = Mesh;

  static WebGLRenderer = WebGLRenderer;

  static Scene = Scene;

  static Camera = Camera;
  static FreeCamera = FreeCamera;

  static HelperManager = HelperManager; //DEPRECATE from core

  static Vector3 = Vector3;
  
}

export default VALO;
/**
 * Copyright Oliver Mulari 2021
 */
import { BoxGeometry } from './geometries/BoxGeometry';
import { PlaneGeometry } from './geometries/PlaneGeometry';
import { SphereGeometry } from './geometries/SphereGeometry';
import { WebGLRenderer } from './renderers/WebGLRenderer';
import { Scene } from './scenes/Scene';
import { StandardMaterial } from './materials/StandardMaterial';
import { Color } from './materials/Color';
import { NaiveMaterial } from './materials/NaiveMaterial';
import { Mesh } from './objects/Mesh';
import { DirectionalLight } from './lights/DirectionalLight';
import { Camera } from './cameras/Camera';
import { FreeCamera } from './cameras/FreeCamera';
import { TargetCamera } from './cameras/TargetCamera';
import { Vector3 } from './math/Vector3';
import { HelperManager } from './helpers/HelperManager';
import { VALO2D } from './valo2D';

export default class VALO {
  static BoxGeometry = BoxGeometry;
  static PlaneGeometry = PlaneGeometry;
  static SphereGeometry = SphereGeometry;
  static WebGLRenderer = WebGLRenderer;
  static Scene = Scene;
  static StandardMaterial = StandardMaterial;
  static Color = Color;
  static NaiveMaterial = NaiveMaterial;
  static Mesh = Mesh; 
  static DirectionalLight = DirectionalLight;
  static Camera = Camera;
  static FreeCamera = FreeCamera;
  static TargetCamera = TargetCamera;
  static Vector3 = Vector3;
  static HelperManager = HelperManager;
  static VALO2D = VALO2D;
}

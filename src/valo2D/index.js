/* eslint-disable no-undef */
import Canvas from './canvas';
import Scene from './scene';
import Renderer2D from './renderer2D';
import Rectangle from './shapes/rectangle';
import Circle from './shapes/circle';
import CustomShape from './shapes/custom';
import VertexData from './shapes/geometry/vertexdata';

import Vec2 from './utils/math/vector2';
import Color from './utils/color';
import Matrix3 from './utils/math/matrix3';
import TextureLoader from './loaders/textureloader';
import Program from './webglutils/program';

const defaultBackgroundColor = [0.68, 0.59, 0.84, 1];

const basicOptions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: defaultBackgroundColor,
  autoResize: true,
  clearBeforeRender: true,
  preserveDrawingBuffer: false,
  transparent: false
});

/**
 * Copyright 2019 Oliver Mulari
 */
export default class VALO2D {
  /**
   * @param {object} options
   */
  constructor(divID, options) {
    // the element id program runs in
    this.divID = divID;
    // makes sure that basic options are set
    this.options = Object.assign(basicOptions(), options || {});

    this.canvas;
    this.renderer;
    this.scene;

    this.init();
  }

  init() {
    const canvas = new Canvas(this.divID, this.options);
    const renderer = new Renderer2D(canvas);
    const scene = new Scene(canvas, renderer);
    renderer.scene = scene;

    this.canvas = canvas;
    this.scene = scene;
    this.renderer = renderer;
  }

  destroy() {
    this.scene.destroy();
    this.renderer.destroy();
    this.canvas.destroy();
    this.options = null;
    this.renderer = null;
    this.scene = null;
    this.canvas = null;
  }
}

// Some routing

VALO2D.Scene = Scene;
VALO2D.Renderer2D = Renderer2D;

// Shapes

VALO2D.Circle = Circle;
VALO2D.Rectangle = Rectangle;
VALO2D.CustomShape = CustomShape;

// Geometry

VALO2D.VertexData = VertexData;

// Utils

VALO2D.Vec2 = Vec2;
VALO2D.Matrix3 = Matrix3;
VALO2D.Color = Color;

VALO2D.TextureLoader = TextureLoader;
VALO2D.Program = Program;

// Functions

import { isMobile } from './utils/mobile';
VALO2D.isMobile = isMobile;
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
 * 
 * VALO.js is simple 2D graphics engine for WebGL2
 */
export default class VALO {
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

VALO.Scene = Scene;
VALO.Renderer2D = Renderer2D;

// Shapes

VALO.Circle = Circle;
VALO.Rectangle = Rectangle;
VALO.CustomShape = CustomShape;

// Geometry

VALO.VertexData = VertexData;

// Utils

VALO.Vec2 = Vec2;
VALO.Matrix3 = Matrix3;
VALO.Color = Color;

VALO.TextureLoader = TextureLoader;
VALO.Program = Program;

// Functions

import { isMobile } from './utils/mobile';
VALO.isMobile = isMobile;
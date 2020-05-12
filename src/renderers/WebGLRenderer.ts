import { CanvasManager } from '../interactions/CanvasManager';
import { Scene } from '../scenes/Scene';
import { Inspector } from '../inspector/Inspector';
import { ProgramManager } from './webgl/ProgramManager';
import { WebGLUtils } from './webgl/WebGLUtils';
import { RenderItem } from './webgl/RenderList';
import { RenderList } from './webgl/RenderList';
import { ATTRIBUTE_LOCATION } from '../geometries/Geometry';
import { HelperManager } from '../helpers/HelperManager';
import { Matrix4 } from '../math/Matrix4';
import { StandardMaterial } from '../materials/StandardMaterial';
import { UBO } from './webgl/UBO';
import { Uniform } from './webgl/Uniform';
import { Light } from '../lights/Light';
import { Color } from '../materials/Color';

const _m4 = new Matrix4();

const _clearColor = [ 37, 37, 37, 255 ].map(n => n / 255);

interface WebGLRendererOptions {
  clearBeforeRender: boolean;
  antialiazing: boolean;
  inspector: boolean;
  pixelRatio: number;
}

/**
 * Renderer 3D
 */
export class WebGLRenderer {

  canvas?: CanvasManager;
  inspector?: Inspector;
  gl?: WebGL2RenderingContext;
  programManager: ProgramManager;
  readyForRendering: boolean;
  stopRenderLoopGiven: boolean;
  clearBeforeRender: boolean;
  antialias: boolean;
  pixelRatio: number;
  previousTime: number;

  constructor( options?: WebGLRendererOptions ) {

    this.canvas;
    this.inspector = options && options.inspector ? new Inspector() : undefined;
    this.gl;
    this.programManager = new ProgramManager(this);

    this.readyForRendering = false;
    this.stopRenderLoopGiven = false;

    this.clearBeforeRender = options && options.clearBeforeRender ? options.clearBeforeRender : false;
    this.antialias = options && options.antialiazing ? options.antialiazing : true;
    this.pixelRatio = options && options.pixelRatio ? options.pixelRatio : 1;

    this.previousTime = 0;

  }

  /**
   * Attaches WebGLRenderer to a DOMElement
   * @param divId div id, if undefined canvas is attached to the body
   */
  attachTo( divId?: string ): boolean {

    const canvas = new CanvasManager( this.pixelRatio, divId );

    if ( this.inspector !== undefined ) {
      this.inspector._init( canvas );
    }

    const options: WebGLContextAttributes = {
      alpha: true,
      antialias: this.antialias,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    };

    const gl = WebGLUtils.getWebGLObject( canvas.element, options );

    if (!gl) {
      console.error('Error in WebGLRenderer.attachTo()');
      canvas.destroy();
      return false;
    }

    // TODO: webgl1 support
    if (!(gl instanceof WebGL2RenderingContext)) {
      // TODO: add polyfills
      return false;
    }

    // Setup GL
    WebGLUtils.setupGL( gl );

    // create uniform buffer object cache
    UBO.create(gl, 'Transform', 0, [
      new Uniform('world', 'mat4'),
      new Uniform('worldViewProjection', 'mat4'),
      new Uniform('worldInverseTranspose', 'mat4'),
    ]);
    UBO.create(gl, 'Material', 1, [
      new Uniform('matAmbient', 'vec3'),
      new Uniform('matDiffuse', 'vec3'),
      new Uniform('matSpecular', 'vec4'),
    ]);
    UBO.create(gl, 'Light', 2, [
      new Uniform('lightAmbient', 'vec3'),
      new Uniform('lightDiffuse', 'vec3'),
      new Uniform('lightSpecular', 'vec3'),
    ]);

    this.canvas = canvas;
    this.gl = gl;

    return true;

  }

  render( scene: Scene ): void {

    const canvas = this.canvas;
    if (canvas === undefined) { return; }

    // INTERACTIONS

    canvas.interactionManager.updateScene( scene );

    // CHECK ASPECT

    if (canvas.didAspectUpdate) {

      scene.setAspectToActiveCamera( canvas.aspect );

      canvas.didAspectUpdate = false;

    }

    // ON BEFORE RENDER

    scene.onBeforeRender();

    if (this.inspector !== undefined) {
      this.inspector.sceneUpdate( scene );
    }

    const gl = this.gl;
    if (!gl) {console.error(`VALO.WebGLRenderer: gl object is ${gl}`); return;}
  
    // setup gl and canvas

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const clearBeforeRender = true;

    if (clearBeforeRender) {
      const c = _clearColor;
      gl.clearColor(c[0], c[1], c[2], c[3]);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    // check scene to be drawn

    RenderList.checkIfUpdate(gl, this.programManager, scene);

    // update buffers in lists

    if ( scene.buffersNeedUpdate ) {

      scene.renderLists.forEach( list => {

        list.items.forEach(item => {
        
          const geometry = item.geometry;
          geometry.setBuffers(gl);
          geometry.bindBuffers(gl, item.program);
  
        });

      });

    }

    // RENDER

    // sometimes multile lists
    scene.renderLists.forEach(list => {

      gl.useProgram(list.program.WebGLProgram);
      const transform = UBO.cache['Transform'];
      transform.update('worldViewProjection', scene.viewProjectionMatrix.elements);

      list.items.forEach(item => {

        if (item.mesh.isInFrustum) {

          // bind buffers only once for clones

          this.renderItem(gl, item, scene);

        } else {

          // nothing

        }

        // render shadows?

      });

      gl.useProgram(null);

    });

    // after object render check if bounding box is visible and should be rendered

    if (scene.helperManager !== undefined) {

      this.renderHelpers( gl, scene, scene.helperManager );

    }

    // AFTER RENDER

    scene.onAfterRender();

  }

  renderItem( gl: WebGL2RenderingContext, item: RenderItem, scene: Scene ): void {

    const obj = item.mesh;
    const geometry = item.geometry;
    const material = item.material;
    const program = item.program;

    let count = 0;

    // uniforms (could be done with fever checks)

    if (scene.activeCamera === null) return;

    // general transforms
    const transform = UBO.cache['Transform'];
    transform.update('world', obj.worldMatrix.elements);

    if (material instanceof Color) {

      // only color
      program.preRender('u_color', material.color);

    } else if (material instanceof StandardMaterial) {

      // transforms for lighting
      _m4.inverse( obj.worldMatrix );
      _m4.transponse( _m4 );
      transform.update('worldInverseTranspose', _m4.elements);
  
      const mat = UBO.cache['Material'];
      mat.update('matAmbient', material.ambient.getAsArray());
      mat.update('matDiffuse', material.diffuse.getAsArray());
      mat.update('matSpecular', [...material.specular.getAsArray(), material.shininess]);
  
      if (Light.cache.amount === 1) {
        const directionalLight = Light.cache.arr[0];
        const light = UBO.cache['Light'];
        light.update('lightAmbient', directionalLight.ambient.getAsArray());
        light.update('lightDiffuse', directionalLight.diffuse.getAsArray());
        light.update('lightSpecular', directionalLight.specular.getAsArray());
        program.preRender('u_reverseLightDirection', directionalLight.reverseDirection.getAsArray());
      }

      program.preRender('u_viewPosition', scene.activeCamera.position.getAsArray());

    }

    // DRAW THE GEOMETRY

    const primitiveType = gl.TRIANGLES;
    const offset = 0;

    // attributes
      
    const attributes = geometry.attributes;
    const vao = geometry.vao;
    const indices = attributes[ATTRIBUTE_LOCATION.INDICES];

    if (!vao) { console.error('VALO.Mesh: renderItem() has no VerexArrayObject'); return; }

    gl.bindVertexArray(vao);

    // check indices last

    if (indices.array) {

      count = indices.array.length;

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);

      gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);

      // clean
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    } else {

      gl.drawArrays(primitiveType, offset, count);

    }

    // cleanup
    gl.bindVertexArray(null);

  }

  renderHelpers( gl: WebGL2RenderingContext, scene: Scene, helperManager: HelperManager ): void {

    const boxes = helperManager.boxes;

    if (boxes !== null) {

      this.programManager.setHelperBoxProgram( gl );
      const program = this.programManager.helperBoxProgram;
      if (!program) {console.error('VALO.WebGLRenderer: renderBoundingBox() no program created succesfully'); return;}

      boxes.forEach( box => {

        const geometry = box.geometry;

        // pre-render checks

        if (!box.geometry.hasPositions) {
          box.setGeometry();
        }

        if (!geometry.isBuffersSet) {
          geometry.setBuffers(gl);
          geometry.bindBuffers(gl, program);
        }

        // render

        gl.useProgram(program.WebGLProgram);

        const vao = box.geometry.vao;
        if (!vao) {console.error('BoundingBox has no VerexArrayObject'); return;}

        // uniforms
        const obj = box.mesh;

        // Set the matrix.
        const transform = UBO.cache['Transform'];
        transform.update('worldViewProjection', scene.viewProjectionMatrix.elements);

        const indices = geometry.attributes[ATTRIBUTE_LOCATION.INDICES];

        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);    

        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);

      });

    }

    /*
    // Unverified code
    const cameras = helperManager.cameras;

    if ( cameras !== null ) {

      cameras.forEach( camera => {

        this.programManager.setHelperBoxProgram( gl );
        const program = this.programManager.helperBoxProgram;
        if (!program) {console.error('VALO.WebGLRenderer: renderBoundingBox() no program created succesfully'); return;}

        const geometry = camera.geometry;

        // pre-render checks

        if (!camera.geometry.hasPositions) {
          camera.setGeometry();
          console.log(camera.geometry.getPositions());
        }

        if (!geometry.isBuffersSet) {
          geometry.setBuffers(gl);
          geometry.bindBuffers(gl, program);
        }

        // render

        gl.useProgram(program.WebGLProgram);

        const vao = camera.geometry.vao;
        if (!vao) {console.error('BoundingBox has no VerexArrayObject'); return;}

        program.preRender('u_worldViewProjection', _m4.elements);

        const indices = geometry.attributes[ATTRIBUTE_LOCATION.INDICES];

        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices.buffer);    

        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 0);
        
      });

    }
    */

  }

  /**
   * Function that starts the render loop
   */
  runRenderLoop( func: () => void ): void {

    window.requestAnimationFrame(() => {

      func();

      if (this.stopRenderLoopGiven) return;

      this.runRenderLoop(func);

    });

  }
}
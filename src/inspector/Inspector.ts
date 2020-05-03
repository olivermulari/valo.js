import { CanvasManager } from '../interactions/CanvasManager';
import { Scene } from '../scenes/Scene';
import { Object3D } from '../objects/Object3D';
import { Mesh } from '../objects/Mesh';
import { StandardMaterial } from '../materials/StandardMaterial';
import { KnobInput } from './components/KnobInput';

interface InspectorOptions {
  visible: boolean;
}

export class Inspector {

  visible: boolean;
  scene?: Scene;
  nodes: Array<HTMLElement>;

  constructor( options?: InspectorOptions ) {

    this.visible = ( options !== undefined ) && options.visible ? options.visible : true;

    this.scene;
    this.nodes = [];

  }

  _init( canvasManager: CanvasManager ): void {

    const id = canvasManager.divID;

    if ( id === undefined ) { return; }

    const canvas = document.getElementById(id);

    if ( canvas === null ) { return; }

    /**
     * <div id="valo-inspector">
     *    <div class="title"><h1>Inspector</h1></div>
     *    <div id="valo-inspector-scene"></div>
     *    <div id="valo-inspector-object"></div> 
     * </div>
     */

    // Main container

    const div = document.createElement('div');
    div.id = 'valo-inspector';

    div.style.position = 'absolute';
    div.style.top = '0px';
    div.style.right = '0px';
    div.style.height = `${canvas.getBoundingClientRect().height}px`;
    div.style.width = '200px';
    // div.style.backgroundColor = 'rgb(10, 10, 10)';
    div.style.color = 'rgb(45, 156, 39)';
    div.style.pointerEvents = 'none';

    div.style.userSelect = 'none';

    div.style.fontFamily = 'Courier, monospace';

    // Title

    const title = document.createElement('div');
    title.classList.add('title');

    const h1 = document.createElement('h1');
    h1.style.margin = '0px';
    h1.innerText = 'INSPECTOR';
    h1.style.fontFamily = 'Courier, monospace';
    h1.style.fontSize = '14px';
    h1.style.textAlign = 'center';

    title.appendChild(h1);

    div.appendChild(title);

    // div.style.color = 'rgb(199, 248, 195)';

    // Scene container

    const scene = document.createElement('div');
    scene.id = 'valo-inspector-scene';

    const obj = document.createElement('div');
    obj.id = 'valo-inspector-object';

    div.appendChild(scene);
    div.appendChild(obj);

    canvas.appendChild(div);

  }

  sceneUpdate( scene: Scene ): void {

    if (this.scene === undefined) {
      this.scene = scene;
    }

    let update = scene.meshListDidUpdate;

    if ( scene.id !== this.scene.id ) {
      this.resetScene();
      this.scene = scene;
      update = true;
    }

    if ( !update ) return;

    this.scene.meshes.forEach( mesh => {

      this.addNode( mesh );

    });

  }

  addNode( obj: Object3D ): void {

    /**
     * <div>
     *    <h1>{obj.name}</h1>
     * </div>
     */

    const div = document.createElement('div');
    div.style.paddingLeft = '10px';
    div.style.backgroundColor = 'rgb(50, 50, 50)';
    div.style.border = '1px solid grey';

    const h1 = document.createElement('h1');
    h1.style.margin = '0px';
    h1.innerText = obj.name;
    h1.style.fontFamily = 'Courier, monospace';
    h1.style.fontSize = '12px';

    if ( obj instanceof Mesh ) {
      h1.onclick = (): void => this.displayMeshOptions( obj );
    }

    if ( h1.onclick !== null ) {
      h1.style.cursor = 'pointer';
      h1.style.pointerEvents = 'auto';
    }

    div.appendChild(h1);

    const container = document.getElementById('valo-inspector-scene');

    if ( container !== null ) {
      container.appendChild(div);
    }

  }

  displayMeshOptions( mesh: Mesh ): void {

    console.log(mesh.name);

    const container = document.getElementById('valo-inspector-object');
    if ( container === null ) { return; }

    // force clear
    container.innerHTML = '';

    const material = mesh.material;
    const matDiv = document.createElement('div');

    if ( material instanceof StandardMaterial ) {

      new KnobInput( container );

      const slide1 = document.createElement('input');
      slide1.type = 'range';
      slide1.min = '1';
      slide1.max = '100';
      slide1.value = `${Math.floor( material.diffuse.x * 100 )}`;
      slide1.style.pointerEvents = 'auto';

      slide1.oninput = (): void => { material.diffuse.x = slide1.valueAsNumber * 0.01;};

      const slide2 = document.createElement('input');
      slide2.type = 'range';
      slide2.min = '1';
      slide2.max = '100';
      slide2.value = `${Math.floor( material.diffuse.y * 100 )}`;
      slide2.style.pointerEvents = 'auto';

      slide2.oninput = (): void => { material.diffuse.y = slide2.valueAsNumber * 0.01;}; 

      const slide3 = document.createElement('input');
      slide3.type = 'range';
      slide3.min = '1';
      slide3.max = '100';
      slide3.value = `${Math.floor( material.diffuse.z * 100 )}`;
      slide3.style.pointerEvents = 'auto';

      slide3.oninput = (): void => { material.diffuse.z = slide3.valueAsNumber * 0.01;}; 

      matDiv.appendChild(slide1);
      matDiv.appendChild(slide2);
      matDiv.appendChild(slide3);

    }

    container.appendChild(matDiv);

  }

  resetScene(): void {

    this.nodes.forEach( el => {

      const parent = el.parentNode;
      if ( parent !== null ) {
        parent.removeChild(el);
      }

    });

    this.nodes = [];

  }

}
import { InteractionManager } from './InteractionManager';

let _canvasId = 0;

/**
 * Canvas manager object
 */
export class CanvasManager {

  divID: string;
  canvasID: number;
  width: number;
  height: number;
  aspect: number;
  element: HTMLCanvasElement | null;
  elementId: string;
  interactionManager: InteractionManager;
  enableInteractions: boolean;
  pixelRatio: number;
  autoResize: boolean;
  didAspectUpdate: boolean;

  constructor( divID?: string ) {

    this.divID = ( divID !== undefined ) ? divID : `valo-div${_canvasId}`;
    this.canvasID = _canvasId;

    // dimentions
    this.width = 0;
    this.height = 0;

    this.aspect = 0;
    this.didAspectUpdate = false;

    // canvas element in DOM
    this.element = null;
    this.elementId = `valo-canvas${_canvasId++}`;

    this.interactionManager = new InteractionManager( this );
    this.enableInteractions = true;

    this.pixelRatio = process.env.NODE_ENV === 'test' ? 1 : window.devicePixelRatio;
    this.autoResize = true;

    /*
    this.clearBeforeRender = clearBeforeRender;
    this.preserveDrawingBuffer = preserveDrawingBuffer;
    this.transparent = transparent;
    */

    this._init();
    
  }

  /**
   * Initial function
   */
  _init(): void {
    
    if ( process.env.NODE_ENV === 'test' ) { return; }

    const canvas = this.createCanvas();

    if (this.enableInteractions) {
      this.interactionManager._init( canvas );
    }

    // adds resizes if setted in the setup
    if (this.autoResize) {
      window.addEventListener('resize', this.resize(this));
    }

  }

  /**
   * Creates an canvas element to the page
   */
  createCanvas(): HTMLCanvasElement {

    if (this.autoResize) {
      this.adjustToTheParent();
    }

    // create a new DOM element
    const element = document.createElement('canvas');
    element.setAttribute('id', this.elementId);

    // canvas attributes
    element.width = this.width * this.pixelRatio;
    element.height = this.height * this.pixelRatio;

    this.element = element;
    let div = document.getElementById( this.divID );

    // if div is not given, create a new one
    if ( div === null ) {

      div = document.createElement('div');
      
      div.style.width = `${window.innerWidth}px`;
      div.style.height = `${window.innerHeight}px`;

      document.body.appendChild(div);

    }

    div.style.overflow = 'hidden';

    div.appendChild(element);
    
    // styles
    this.addStyles();

    return element;

  }

  /**
   * Adds an stylesheet into the head of HTML
   */
  addStyles(): void {

    const canvas = this.element;
    if (!canvas) { console.error('VALO.CanvasManager: addStyles() no canvas element assigned' ); return;}

    canvas.style.width    = `${this.width}px`;
    canvas.style.height   = `${this.height}px;`;
    canvas.style.margin   = '0px';
    canvas.style.position = 'absolute';
    canvas.style.top      = '0px';
    canvas.style.left     = '0px';
    canvas.style.overflow = 'hidden';

  }

  /**
   * Adjusts this.width and this.height properties to the parent div
   * or window
   */
  adjustToTheParent(): void {

    // adjust to the div
    if (this.divID) {
      const div = document.getElementById(this.divID);
      if (!div) return;

      const dimentions = div.getBoundingClientRect();
      this.width = dimentions.width;
      this.height = dimentions.height;

    // or adjust to the screen
    } else {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    this.setAspect();

  }

  setAspect(): void {

    if (this.height > 0) {
      this.aspect = this.width / this.height;
      this.didAspectUpdate = true;
    }

  }

  /**
   * Resies canvas and its properties
   */
  resize(self: CanvasManager): () => void {

    return (): void => {

      self.adjustToTheParent();

      const element = this.element;
      if (!element) { return; }

      element.width = self.width * self.pixelRatio;
      element.height = self.height * self.pixelRatio;
      element.style.width = `${self.width}px`;
      element.style.height = `${self.height}px`;

    };

  }

  /**
   * Destroys canvas element
   */
  destroy(): void {

    window.removeEventListener('resize', this.resize(this));

    const element = this.element;
    if (element && element.parentNode) { 
      element.parentNode.removeChild(element);
    }

  }
  
}
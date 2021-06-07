/**
 * Canvas controller object
 */
export default class Canvas {
  constructor(divID, options) {
    this.divID = divID;
    this.options = options;

    // canvas element in DOM
    this.element;
    this.elementId = 'scene';

    this.width = this.options.width;
    this.height = this.options.height;

    this.backgroundColor = this.options.backgroundColor;

    this.pixelRatio = process.env.NODE_ENV === 'test' ? 1 : window.devicePixelRatio;
    this.autoResize = this.options.autoResize;

    this.clearBeforeRender = this.options.clearBeforeRender;
    this.preserveDrawingBuffer = this.options.preserveDrawingBuffer;
    this.transparent = this.options.transparent;

    this.resizeFunction = null;

    this.init();
  }

  /**
   * Initial function
   */
  init() {
    if (process.env.NODE_ENV === 'test') { return; }

    this.createCanvas(this.divID);

    // adds resizes if setted in the setup
    if (this.autoResize) {
      const onResize = () => this.resize(this);
      window.addEventListener('resize', onResize);
      this.resizeFunction = onResize;
    }
  }

  /**
   * Creates an canvas element to the page
   */
  createCanvas(divID) {
    if (this.autoResize) {
      this.adjustToTheParent();
    }

    // create a new DOM element
    this.element = document.createElement('canvas');
    this.element.setAttribute('id', this.elementId);

    // canvas attributes
    this.element.width = this.width * this.pixelRatio;
    this.element.height = this.height * this.pixelRatio;

    // add to document
    if (divID) {
      const div = document.getElementById(divID);
      div.appendChild(this.element);
    } else {
      // add to body
      document.body.appendChild(this.element);
    }
    
    // styles
    this.addStyles();
  }

  /**
   * Adds an stylesheet into the head of HTML
   */
  addStyles() {
    const styleElement = document.createElement('style');

    // Append <style> element to <head>
    document.head.appendChild(styleElement);

    const styleSheet = styleElement.sheet;

    const rules = `
    #${this.elementId} {
      width: ${this.width}px;
      height: ${this.height}px;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
    }
    `;

    styleSheet.insertRule(rules, 0);
  }

  /**
   * Adjusts this.width and this.height properties to the parent div
   * or window
   */
  adjustToTheParent() {
    // adjust to the div
    if (this.divID) {
      const div = document.getElementById(this.divID);
      const dimentions = div.getBoundingClientRect();
      this.width = dimentions.width;
      this.height = dimentions.height;

    // or adjust to the screen
    } else {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
  }

  /**
   * Resies canvas and its properties
   */
  resize(self) {
    self.adjustToTheParent();
    self.element.width = self.width * self.pixelRatio;
    self.element.height = self.height * self.pixelRatio;
    self.element.style.width = `${self.width}px`;
    self.element.style.height = `${self.height}px`;
  }

  /**
   * Destroys canvas element
   */
  destroy() {
    if (this.resizeFunction) {
      window.removeEventListener('resize', this.resizeFunction);
    }

    this.element.parentNode.removeChild(this.element);

    this.backgroundColor = null;
    this.options = null;
    this.element = null;
  }
}
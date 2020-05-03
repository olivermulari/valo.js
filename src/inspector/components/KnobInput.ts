export class KnobInput {

  parent: HTMLElement | HTMLDocument;
  listener: ( (newValue: number) => void ) | undefined;
  min: number;
  max: number;
  value: number;
  size: number;
  width: number;
  color: string;

  constructor( parent: HTMLElement | HTMLDocument, listener?: (newValue: number) => void ) {

    this.parent = parent;
    this.listener = listener;

    this.min = 0;
    this.max = 100;
    this.value = 50;

    this.size = 30;
    this.width = 2;
    this.color = 'rgb(0, 0, 255)';

    this.create();

  }

  setAttributesNS( el: SVGElement, ...args: string[] ): void {

    if (args.length % 2 !== 0) {console.log('Invalid length of args'); return;}

    for (let i = 0; i < args.length; i += 2) {
      el.setAttributeNS(null, args[i], args[i+1]);
    }

  }

  create(): void {

    /**
     * <div>
     *    <svg>
     *      <circle/>
     *      <circle/>
     *    </svg>
     *    <p>{ this.value }</p>
     * </div>
     */

    const div = document.createElement('div');
    div.style.width = `${this.size}px`;
    div.style.height = `${this.size}px`;
    div.style.position = 'relative';

    const pie = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.setAttributesNS( pie, 
      'width', `${this.size}`,
      'height', `${this.size}`,
      'viewBox', `0 0 ${this.size} ${this.size}`
      );

    const radius = ( this.size / 2 ) - ( this.width / 2 );

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.setAttributesNS( circle, 
      'cx',`${this.size/2}`,
      'cy',`${this.size/2}`,
      'r',`${radius}`,
      'fill','none',
      'stroke','#e6e6e6',
      'stroke-width',`${this.width}`
      );

    const arc = 2 * Math.PI * radius;

    const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.setAttributesNS( circle2, 
      'cx',`${this.size/2}`,
      'cy',`${this.size/2}`,
      'r',`${radius}`,
      'fill','none',
      'stroke',`${this.color}`,
      'stroke-width',`${this.width}`,
      'stroke-dasharray',`calc(${this.value} * ${arc} / 100) ${arc}`,
      'transform',`rotate(90) translate(0, -${this.size})`
      );

    pie.appendChild(circle);
    pie.appendChild(circle2);

    const val = document.createElement('p');
    val.innerText = `${this.value}`;
    val.style.margin = '0px';
    val.style.position = 'absolute';
    val.style.top = '50%';
    val.style.left = '50%';
    val.style.transform = 'translateX(-50%) translateY(-50%)';
    val.style.color = this.color;

    div.appendChild(pie);
    div.appendChild(val);

    this.parent.appendChild(div);

  }

  update(): void {

    if (this.listener !== undefined) {
      this.listener(this.value);
    }
    
  }

}
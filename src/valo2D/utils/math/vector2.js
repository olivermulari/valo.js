export default class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // saves array object
    this._arr = null;
  }
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  addInPlace(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }
  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  multiply(num) {
    this.x *= num;
    this.y *= num;
    return this;
  }
  div(n) {
    this.x /= n;
    this.y /= n;
    return this;
  }
  mag() {
    return Math.sqrt(this.magSq());
  }
  magSq() {
    const x = this.x, y = this.y;
    return x * x + y * y;
  } 
  limit(l) {
    const mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq));
      this.multiply(l);
    }
    return this;
  }
  normalize() {
    return this.div(this.mag());
  }
  setMag(n) {
    return this.normalize().multiply(n);
  }
  clone() {
    return new Vec2(this.x, this.y);
  }
  getAsArray() {
    if (!this._arr) this._arr = [this.x, this.y];
    else this._arr[0] = this.x; this._arr[1] = this.y;
    return this._arr;
  }
  getAsArrayScaled(f) {
    if (!this._arr) this._arr = [this.x, this.y];
    else this._arr[0] = this.x; this._arr[1] = this.y;
    return this._arr.map(x => x * f);
  }
}

import { DirectionalLight } from './DirectionalLight';

interface LightCache {
  amount: number;
  arr: DirectionalLight[];
}

export class Light {

  type: string;
  static cache: LightCache;

  constructor() {
    this.type = 'light';
  }

  static push(light: DirectionalLight): void {
    Light.cache.arr.push(light);
    Light.cache.amount += 1;
  }

}

Light.cache = {
  amount: 0,
  arr: []
};
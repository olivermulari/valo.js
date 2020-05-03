import 'mocha';

import vector from './math/vector';
import plane from './math/plane';
import box from './math/box';
import frustum from './math/frustum';
import euler from './math/euler';

import scene from './scene/interactions';

describe('VALO.js', () => {
  

  describe('math', () => {

    describe('vector', vector);
    describe('plane', plane);
    describe('box', box);
    describe('frustum', frustum);

    describe('euler', euler);

  });

  describe('scene', () => {

    describe('interactions', scene);

  });

});
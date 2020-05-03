import { assert } from 'chai';
import { Box } from '../../src/math/Box';

export default function box(): void {
  
  it('Should create a Box', function() {

    assert.ok( new Box() instanceof Box );

  });

}
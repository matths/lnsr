import tap from 'tap';
import objectMap from '../../../../lib/utils/object-map.mjs';

tap.test('objectMap', tap => {

  tap.test('when using objectMap', tap => {
    tap.plan(1);

    const from = {
      a: 1,
      b: 'word',
      c: true
    };

    const to = {
      a: ['number', 'a', 0],
      b: ['string', 'b', 1],
      c: ['boolean', 'c', 2]
    };

    tap.same(objectMap(from, (v, k, i) => [typeof v, k, i]), to, 'should return exoected result');
    tap.end();
  });

  tap.end();
});

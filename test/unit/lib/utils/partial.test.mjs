import tap from 'tap';
import partial from '../../../../lib/utils/partial.mjs';

tap.test('partial', tap => {
  tap.test('when using partial', tap => {
    tap.plan(3);
    const add = (a, b) => a + b;
    const sum = (...args) => args.reduce(add, 0);
    const add1 = partial(add, 1);
    const add10 = partial(sum, 4, 6);
    tap.strictEqual(typeof add1, 'function', 'should return a function');
    tap.strictEqual(add1(2), sum(1, 2), 'function should return same value as initial function');
    tap.strictEqual(add10(2), 12, 'function should return same value as initial function');
    tap.end();
  });
  tap.end();
})

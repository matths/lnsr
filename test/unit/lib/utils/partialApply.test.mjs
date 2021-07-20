import tap from 'tap';
import partialApply from '../../../../lib/utils/partialApply.mjs';

tap.test('partialApply', tap => {
  tap.test('when using partialApply', tap => {
    tap.plan(2);
    const add = (a, b) => a + b;
    const sum = (...args) => args.reduce(add, 0);
    const add40 = partialApply(sum, [5, 15, 20]);
    tap.equal(typeof add40, 'function', 'should return a function');
    tap.equal(add40(10), 50, 'function should return same value as initial function');
    tap.end();
  });
  tap.end();
});

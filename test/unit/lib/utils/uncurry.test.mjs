import tap from 'tap';
import uncurry from '../../../../lib/utils/uncurry.mjs';

tap.test('uncurry', tap => {
  tap.test('when uncurried functions are used', tap => {
    tap.plan(1);
    const sum = a => b => a + b;
    const uncurriedSum = uncurry(sum);
    tap.strictEqual(sum(1)(2), uncurriedSum(1,2), 'should lead to same result for method with two parameters');
    tap.end();
  });
  tap.end();
});

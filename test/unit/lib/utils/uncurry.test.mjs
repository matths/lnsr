import tap from 'tap';
import uncurry from '../../../../lib/utils/uncurry';

tap.test('uncurry', tap => {
  let req;
  
  tap.test('when uncurried functions are used', tap => {
    tap.plan(1);
    const sum = a => b => a + b;
    const uncurriedSum = uncurry(sum);
    tap.strictEqual(sum(1)(2), uncurriedSum(1,2), 'should lead to same result for methods two parameters');
    tap.end();
  });

  tap.end();
})

import tap from 'tap';
import uncurryn from '../../../../lib/utils/uncurryn.mjs';

tap.test('uncurryn', tap => {
  tap.test('when using uncurryn', tap => {
    tap.plan(7);
    const addFour = a => b => c => d => a + b + c + d;
    const uncurriedAddFour = uncurryn(4)(addFour);
    tap.equal(typeof uncurriedAddFour, 'function', 'should return a function');
    tap.equal(uncurryn(1)(addFour)(1)(2)(3)(4), 10, 'should lead to same result as step-by-step invocation');
    tap.equal(uncurryn(2)(addFour)(1, 2)(3)(4), 10, 'should lead to same result as step-by-step invocation');
    tap.equal(uncurryn(3)(addFour)(1, 2, 3)(4), 10, 'should lead to same result as step-by-step invocation');
    tap.equal(uncurryn(4)(addFour)(1, 2, 3, 4), 10, 'should lead to same result as step-by-step invocation');
    tap.throws(() => uncurryn(5)(addFour)(1, 2, 3, 4), RangeError, 'too few arguments', 'should throw RangeError when called with too few arguments');
    tap.throws(() => uncurryn(5)(addFour)(1, 2, 3, 4, 5), TypeError, 'f(...) is not a function', 'should throw TypeError when called with too large n');
    tap.end();
  });
  tap.end();
});

import tap from 'tap';
import identity from '../../../../lib/utils/identity.mjs';

tap.test('identity', tap => {
  tap.test('when using identity', tap => {
    tap.plan(2);
    tap.strictEqual(identity(42), 42, 'should return given numeric value');
    tap.strictEqual(identity('abc'), 'abc', 'should return given string');
    tap.end();
  });
  tap.end();
});

import tap from 'tap';
import {atob, btoa} from '../../../../lib/utils/base64.mjs';

tap.test('base64', tap => {

  tap.test('when using atob', tap => {
    tap.plan(1);
    tap.strictEqual(atob('aGVsbG8gd29ybGQ='), 'hello world', 'should encode ascii string as base64');
    tap.end();
  });

  tap.test('when using btoa', tap => {
    tap.plan(1);
    tap.strictEqual(btoa('hello world'), 'aGVsbG8gd29ybGQ=', 'should decode base64 to ascii string');
    tap.end();
  });

  tap.end();
});

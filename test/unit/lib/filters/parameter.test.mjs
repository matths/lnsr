import tap from 'tap';
import httpMocks from 'node-mocks-http';
import parameter from '../../../../lib/filters/parameter.mjs';

tap.test('parameter filter module', tap => {
  let req;
  
  tap.beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob?output-format=pdf&bw=1',
    });
  });

  tap.test('when created parameter filter', tap => {
    tap.plan(1);
    const filter = parameter('bw', 1);
    filter(req);
    tap.ok(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running different parameter filter', tap => {
    tap.plan(6);
    tap.ok(parameter('output-format', 'pdf')(req), 'should match for strings');
    tap.ok(parameter('bw', 1)(req), 'should match for numbers');
    tap.ok(parameter('bw', true)(req), 'should match 1 as boolean true');
    tap.notOk(parameter('output-format', 'html')(req), 'should fail for wrong strings');
    tap.notOk(parameter('bw', 0)(req), 'should fail for wrong numbers');
    tap.notOk(parameter('bw', false)(req), 'should not match 1 as boolean false');
    tap.end();
  });

  tap.afterEach(() => {
    req = null;
  });

  tap.end();
});

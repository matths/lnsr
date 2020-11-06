import tap from 'tap';
import httpMocks from 'node-mocks-http';
import parameter from '../../../../lib/filters/parameter.mjs';

tap.test('parameter filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob?output-format=pdf&bw=1',
    });
    done();
  });

  tap.test('when created parameter filter', tap => {
    tap.plan(1);
    const filter = parameter('bw', 1);
    filter(req);
    tap.true(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running different parameter filter', tap => {
    tap.plan(6);
    tap.true(parameter('output-format', 'pdf')(req), 'should match for strings');
    tap.true(parameter('bw', 1)(req), 'should match for numbers');
    tap.true(parameter('bw', true)(req), 'should match 1 as boolean true');
    tap.false(parameter('output-format', 'html')(req), 'should fail for wrong strings');
    tap.false(parameter('bw', 0)(req), 'should fail for wrong numbers');
    tap.false(parameter('bw', false)(req), 'should not match 1 as boolean false');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
});

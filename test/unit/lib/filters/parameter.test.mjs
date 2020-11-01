import tap from 'tap';
import httpMocks from 'node-mocks-http';
import parameterFilter from '../../../../lib/filters/parameter';

tap.test('parameter filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob?output-format=pdf&bw=1',
    });
    done();
  });

  tap.test('when created parameterFilter filter', tap => {
    tap.plan(1);
    const filter = parameterFilter('bw', 1);
    filter(req);
    tap.true(typeof filter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running different parameterFilter filter', tap => {
    tap.plan(6);
    tap.true(parameterFilter('output-format', 'pdf')(req), 'should match for strings');
    tap.true(parameterFilter('bw', 1)(req), 'should match for numbers');
    tap.true(parameterFilter('bw', true)(req), 'should match 1 as boolean true');
    tap.false(parameterFilter('output-format', 'html')(req), 'should fail for wrong strings');
    tap.false(parameterFilter('bw', 0)(req), 'should fail for wrong numbers');
    tap.false(parameterFilter('bw', false)(req), 'should not match 1 as boolean false');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
})

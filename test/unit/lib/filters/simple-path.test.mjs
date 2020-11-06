import tap from 'tap';
import httpMocks from 'node-mocks-http';
import simplePath from '../../../../lib/filters/simple-path.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created simplePath filter', tap => {
    tap.plan(1);
    const requestFilter = simplePath('Bob');
    requestFilter(req);
    tap.true(typeof requestFilter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running different simplePath filter', tap => {
    tap.plan(2);
    tap.false(simplePath('Alice')(req), 'Alice is not in mock URL path');
    tap.true(simplePath('Bob')(req), 'Bob is in mock URL path');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
});

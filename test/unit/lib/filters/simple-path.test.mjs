import tap from 'tap';
import httpMocks from 'node-mocks-http';
import simplePath from '../../../../lib/filters/simple-path.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
  });

  tap.test('when created simplePath filter', tap => {
    tap.plan(1);
    const requestFilter = simplePath('Bob');
    requestFilter(req);
    tap.ok(typeof requestFilter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running different simplePath filter', tap => {
    tap.plan(2);
    tap.notOk(simplePath('Alice')(req), 'Alice is not in mock URL path');
    tap.ok(simplePath('Bob')(req), 'Bob is in mock URL path');
    tap.end();
  });

  tap.afterEach(() => {
    req = null;
  });

  tap.end();
});

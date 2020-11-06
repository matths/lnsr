import tap from 'tap';
import httpMocks from 'node-mocks-http';
import simplePathFilter from '../../../../lib/filters/simple-path.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created simplePathFilter filter', tap => {
    tap.plan(1);
    const requestFilter = simplePathFilter('Bob');
    requestFilter(req);
    tap.true(typeof requestFilter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running different simplePathFilter filter', tap => {
    tap.plan(2);
    tap.false(simplePathFilter('Alice')(req), 'Alice is not in mock URL path');
    tap.true(simplePathFilter('Bob')(req), 'Bob is in mock URL path');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
})

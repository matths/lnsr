const tap = require('tap');
const httpMocks = require('node-mocks-http');
const passFilter = require('../../../../lib/filters/pass');

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created passFilter filter', tap => {
    tap.plan(1);
    const filter = passFilter('Bob');
    filter(req);
    tap.true(typeof filter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running passFilter filter', tap => {
    tap.plan(2);
    tap.true(passFilter('Alice')(req), 'should return true with parameters');
    tap.true(passFilter()(req), 'should return true without parameters');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
})
